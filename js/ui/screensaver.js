export const slides = [
  { title: "Acércate.", text: "Reúne a tu gente frente a la pantalla." },
  {
    title: "Toca para empezar.",
    text: "Un solo toque. Nosotros hacemos el resto.",
  },
  {
    title: "Sonríe. ¡Diviértete!",
    text: "Prepárate: vienen cuatro fotos con efectos sorpresa.",
  },
  {
    title: "Llévate el recuerdo.",
    text: "Descarga tu collage al terminar. ¿Listos para otra ronda?",
  },
];
// Invoke browser timers on globalThis; storing Window.setInterval directly and
// calling it as this.schedule binds it to Screensaver and can throw Illegal invocation.
export class Screensaver {
  constructor(
    render,
    {
      schedule = (callback, delay) => globalThis.setInterval(callback, delay),
      unschedule = (id) => globalThis.clearInterval(id),
      interval = 5500,
    } = {},
  ) {
    Object.assign(this, { render, schedule, unschedule, interval });
    this.timer = null;
    this.index = 0;
  }
  start() {
    this.stop();
    this.index = 0;
    this.show();
    try {
      this.timer = this.schedule(() => {
        this.index = (this.index + 1) % slides.length;
        this.show();
      }, this.interval);
    } catch {
      // A decorative carousel must never prevent the camera button from loading.
      // Keep the first instruction visible if scheduling is unavailable.
      this.timer = null;
    }
  }
  show() {
    this.render(slides[this.index], this.index, slides.length);
  }
  stop() {
    if (this.timer !== null) this.unschedule(this.timer);
    this.timer = null;
  }
}
