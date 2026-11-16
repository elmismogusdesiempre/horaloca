export class Camera {
  constructor(video) {
    this.video = video;
    this.stream = null;
    this.generation = 0;
  }
  async start() {
    if (!navigator.mediaDevices?.getUserMedia)
      throw new Error(
        "La cámara requiere HTTPS o localhost y un navegador compatible.",
      );
    this.stop();
    const generation = this.generation;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: false,
    });
    const abort = () => {
      stream.getTracks().forEach((t) => t.stop());
      throw new DOMException("Inicio de cámara cancelado.", "AbortError");
    };
    if (generation !== this.generation) abort();
    this.stream = stream;
    this.video.srcObject = stream;
    try {
      await this.video.play();
    } catch (error) {
      if (this.stream === stream) this.stop();
      else stream.getTracks().forEach((t) => t.stop());
      throw error;
    }
    if (generation !== this.generation) abort();
  }
  stop() {
    // Invalidates pending permission requests as well as the active stream.
    this.generation++;
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.video.pause?.();
    this.video.srcObject = null;
  }
  draw(ctx, w, h) {
    const v = this.video;
    if (v.readyState < 2) return;
    const scale = Math.max(w / v.videoWidth, h / v.videoHeight),
      sw = w / scale,
      sh = h / scale;
    ctx.save();
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(
      v,
      (v.videoWidth - sw) / 2,
      (v.videoHeight - sh) / 2,
      sw,
      sh,
      0,
      0,
      w,
      h,
    );
    ctx.restore();
  }
}
