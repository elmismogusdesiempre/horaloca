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
export class Screensaver {
  constructor(
    render,
    {
      schedule = setInterval,
      unschedule = clearInterval,
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
    this.timer = this.schedule(() => {
      this.index = (this.index + 1) % slides.length;
      this.show();
    }, this.interval);
  }
  show() {
    this.render(slides[this.index], this.index, slides.length);
  }
  stop() {
    if (this.timer !== null) this.unschedule(this.timer);
    this.timer = null;
  }
}
