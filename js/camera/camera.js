export class Camera {
  constructor(video) {
    this.video = video;
    this.stream = null;
  }
  async start() {
    if (!navigator.mediaDevices?.getUserMedia)
      throw new Error(
        "La cámara requiere HTTPS o localhost y un navegador compatible.",
      );
    this.stop();
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: false,
    });
    this.video.srcObject = this.stream;
    await this.video.play();
  }
  stop() {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
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
