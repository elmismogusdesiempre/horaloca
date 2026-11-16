import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
export class Tracker {
  constructor() {
    this.faces = [];
    this.lastTime = 0;
    this.lastVideo = -1;
    this.interval = 80;
    this.maxFaces = 3;
    this.ready = false;
    this.cost = 0;
  }
  async init() {
    const files = await FilesetResolver.forVisionTasks("/vendor/wasm");
    const options = {
      baseOptions: {
        modelAssetPath: "/models/face_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numFaces: this.maxFaces,
      minFaceDetectionConfidence: 0.55,
      minTrackingConfidence: 0.6,
    };
    try {
      this.model = await FaceLandmarker.createFromOptions(files, options);
    } catch {
      options.baseOptions.delegate = "CPU";
      this.model = await FaceLandmarker.createFromOptions(files, options);
    }
    this.ready = true;
  }
  update(video, w, h, now) {
    if (
      !this.ready ||
      video.readyState < 2 ||
      now - this.lastTime < this.interval ||
      video.currentTime === this.lastVideo
    )
      return this.faces;
    this.lastTime = now;
    this.lastVideo = video.currentTime;
    const started = performance.now();
    let result;
    try {
      result = this.model.detectForVideo(video, now);
    } catch {
      this.faces = [];
      return this.faces;
    }
    this.cost = performance.now() - started;
    this.interval = this.cost > 65 ? 160 : 80;
    const scale = Math.max(w / video.videoWidth, h / video.videoHeight),
      ow = (video.videoWidth * scale - w) / 2,
      oh = (video.videoHeight * scale - h) / 2;
    const point = (p) => ({
      x: w - (p.x * video.videoWidth * scale - ow),
      y: p.y * video.videoHeight * scale - oh,
    });
    const next = result.faceLandmarks.map((l) => {
      const a = point(l[33]),
        b = point(l[263]),
        eye = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
        forehead = point(l[10]),
        chin = point(l[152]);
      return {
        x: eye.x,
        y: eye.y,
        width: Math.hypot(a.x - b.x, a.y - b.y) * 2.05,
        angle: Math.atan2(a.y - b.y, a.x - b.x),
        forehead,
        chin,
        mouth: point(l[13]),
        nose: point(l[1]),
        seen: now,
      };
    });
    const remaining = [...this.faces];
    this.faces = next.map((f) => {
      let best = -1,
        dist = Infinity;
      remaining.forEach((p, i) => {
        const d = Math.hypot(f.x - p.x, f.y - p.y);
        if (d < dist) {
          best = i;
          dist = d;
        }
      });
      if (best < 0 || dist > f.width * 0.65) return f;
      const old = remaining.splice(best, 1)[0],
        a = 0.48;
      const lerp = (p, q) => p + (q - p) * a;
      let da = f.angle - old.angle;
      da = Math.atan2(Math.sin(da), Math.cos(da));
      return {
        ...f,
        x: lerp(old.x, f.x),
        y: lerp(old.y, f.y),
        width: lerp(old.width, f.width),
        angle: old.angle + da * a,
        mouth: {
          x: lerp(old.mouth.x, f.mouth.x),
          y: lerp(old.mouth.y, f.mouth.y),
        },
        chin: { x: lerp(old.chin.x, f.chin.x), y: lerp(old.chin.y, f.chin.y) },
      };
    });
    // Missed detections are hidden immediately; never reuse an arbitrary screen position.
    return this.faces;
  }
  close() {
    this.model?.close();
    this.faces = [];
    this.ready = false;
  }
}
