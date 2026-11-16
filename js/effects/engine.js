import { byId } from "./catalog.js";
import { accessory } from "./art.js";
import { ambient, frame } from "./scene.js";
export class EffectsEngine {
  constructor() {
    this.logo = null;
    this.quality = 1;
  }
  async setLogo(url) {
    this.logo = null;
    if (!url) return;
    const i = new Image();
    i.src = url;
    await i.decode();
    this.logo = i;
  }
  render(ctx, w, h, ids, faces, time, config) {
    const effects = ids.map((id) => byId.get(id)).filter(Boolean);
    for (const e of effects.filter((e) => e.slot === "ambient"))
      ambient(ctx, e.id, w, h, time, config.color, this.quality);
    for (const e of effects.filter((e) => e.requiresTracking)) {
      for (const f of faces) {
        ctx.save();
        let x = f.x,
          y = f.y;
        if (e.slot === "mouth") {
          x = f.mouth.x;
          y = f.mouth.y + f.width * 0.025;
        }
        if (e.slot === "neck") {
          x = f.chin.x;
          y = f.chin.y + f.width * 0.1;
        }
        ctx.translate(x, y);
        ctx.rotate(f.angle);
        ctx.scale(f.width, f.width);
        accessory(ctx, e.id, time, config.color);
        ctx.restore();
      }
    }
    for (const e of effects.filter((e) => ["frame", "cinema"].includes(e.slot)))
      frame(ctx, e.id, w, h, time, config, this.logo);
  }
}
