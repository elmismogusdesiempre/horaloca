// Hardware release and idle UI are separate transitions. A completed capture
// must go through processing/result, never through the screensaver.
export class GuestFlow {
  constructor({ release, render }) {
    this.release = release;
    this.render = render;
    this.state = "idle";
  }
  set(state) {
    this.state = state;
    this.render(state);
  }
  start() {
    this.set("capturing");
  }
  captured() {
    this.release();
    if (this.state === "capturing") this.set("processing");
  }
  result() {
    if (this.state === "processing") this.set("result");
  }
  idle() {
    this.release();
    this.set("idle");
  }
}
