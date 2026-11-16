export const delay = (ms) => new Promise((r) => setTimeout(r, ms));
export class Session {
  constructor({
    onPhase,
    capture,
    choose,
    finish,
    release = () => {},
    sleep = delay,
  }) {
    Object.assign(this, { onPhase, capture, choose, finish, release, sleep });
    this.running = false;
    this.cancelled = false;
  }
  async run() {
    if (this.running) return false;
    this.running = true;
    this.cancelled = false;
    let released = false;
    const releaseOnce = () => {
      if (!released) {
        released = true;
        this.release();
      }
    };
    try {
      const choices = this.choose(),
        photos = [];
      for (let i = 5; i > 0; i--) {
        this.check();
        this.onPhase({ phase: "prepare", number: i, index: 0 });
        await this.sleep(1000);
      }
      for (let i = 0; i < 4; i++) {
        this.check();
        this.onPhase({ phase: "effect", ids: choices[i], index: i });
        await this.sleep(450);
        for (let n = 3; n > 0; n--) {
          this.check();
          this.onPhase({ phase: "countdown", number: n, index: i });
          await this.sleep(1000);
        }
        this.check();
        photos.push(await this.capture());
        // Release hardware immediately after copying shot 4, before the last
        // flash delay, collage export, storage or result dialog can block.
        if (photos.length === 4) releaseOnce();
        this.onPhase({ phase: "flash", index: i });
        await this.sleep(450);
      }
      this.check();
      await this.finish(photos, choices);
      return true;
    } finally {
      this.running = false;
      releaseOnce();
    }
  }
  check() {
    if (this.cancelled) throw new Error("Sesión cancelada.");
  }
  cancel() {
    this.cancelled = true;
  }
}
