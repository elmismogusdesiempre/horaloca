// Photographic treatments alter the camera pixels, rather than merely adding a
// decorative frame. All treatments run on the same canvas used for export.
const cinematicLooks = new Set([
  "thermal",
  "cyanotype",
  "comic-pop",
  "vhs",
  "film-noir",
  "golden-hour",
  "prism",
  "instant-film",
]);
export class PhotoLooks {
  constructor(canvasFactory) {
    this.factory =
      canvasFactory ||
      ((w, h) => {
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        return c;
      });
    this.scratch = null;
  }
  buffer(w, h) {
    if (!this.scratch) this.scratch = this.factory(w, h);
    if (this.scratch.width !== w) this.scratch.width = w;
    if (this.scratch.height !== h) this.scratch.height = h;
    return this.scratch;
  }
  apply(c, w, h, id, t) {
    c.save();
    if (["security", "spy", "cyanotype", "film-noir"].includes(id)) {
      c.globalCompositeOperation = "saturation";
      c.fillStyle = "#000";
      c.fillRect(0, 0, w, h);
      if (id !== "film-noir") {
        c.globalCompositeOperation = "multiply";
        c.fillStyle =
          id === "security" ? "#42fa73" : id === "spy" ? "#5bdfbf" : "#397dc0";
        c.fillRect(0, 0, w, h);
      }
      c.globalCompositeOperation = "source-over";
    }
    if (id === "security" || id === "spy") {
      c.globalCompositeOperation = "screen";
      c.fillStyle = id === "security" ? "#041806" : "#031310";
      c.fillRect(0, 0, w, h);
      c.globalCompositeOperation = "source-over";
      const step = Math.max(3, Math.round(h / 220));
      c.fillStyle = "#001e0b36";
      for (let y = 0; y < h; y += step) c.fillRect(0, y, w, 1);
      const sweep = ((t * 35) % (h + 80)) - 80,
        g = c.createLinearGradient(0, sweep, 0, sweep + 80);
      g.addColorStop(0, "#aaffb500");
      g.addColorStop(0.6, "#aaffb50d");
      g.addColorStop(1, "#aaffb500");
      c.fillStyle = g;
      c.fillRect(0, sweep, w, 80);
      this.vignette(c, w, h, 0.55);
      this.grain(c, w, h, t, "#bcffc9", 0.12);
    }
    if (id === "thermal" || id === "comic-pop") {
      // Bounded processing resolution keeps the CPU treatment viable on tablets.
      const sw = Math.min(w, 640),
        sh = Math.max(1, Math.round((h * sw) / w)),
        buffer = this.buffer(sw, sh),
        b = buffer.getContext("2d", { willReadFrequently: true });
      b.drawImage(c.canvas, 0, 0, sw, sh);
      const image = b.getImageData(0, 0, sw, sh),
        d = image.data;
      const palette = [
        [10, 18, 66],
        [51, 29, 143],
        [162, 31, 138],
        [241, 79, 50],
        [255, 190, 55],
        [255, 249, 194],
      ];
      for (let i = 0; i < d.length; i += 4) {
        if (id === "thermal") {
          const l =
              ((d[i] * 0.2126 + d[i + 1] * 0.7152 + d[i + 2] * 0.0722) / 255) *
              (palette.length - 1),
            a = Math.floor(l),
            f = l - a,
            p = palette[a],
            q = palette[Math.min(a + 1, palette.length - 1)];
          for (let j = 0; j < 3; j++) d[i + j] = p[j] + (q[j] - p[j]) * f;
        } else {
          for (let j = 0; j < 3; j++)
            d[i + j] = Math.min(255, Math.round(d[i + j] / 64) * 64);
        }
      }
      b.putImageData(image, 0, 0);
      c.drawImage(buffer, 0, 0, w, h);
      if (id === "comic-pop") {
        c.fillStyle = "#25203918";
        c.beginPath();
        const step = Math.max(12, w / 70);
        for (let y = 0; y < h; y += step)
          for (let x = 0; x < w; x += step) {
            c.moveTo(x + 1.5, y);
            c.arc(x, y, 1.5, 0, Math.PI * 2);
          }
        c.fill();
      }
    }
    if (id === "vhs" || id === "prism") {
      const buffer = this.buffer(w, h),
        b = buffer.getContext("2d");
      b.clearRect(0, 0, w, h);
      b.drawImage(c.canvas, 0, 0);
      c.globalCompositeOperation = "screen";
      c.globalAlpha = id === "vhs" ? 0.16 : 0.22;
      if (id === "vhs") {
        c.drawImage(buffer, Math.sin(t * 12) * w * 0.006, 0);
        c.globalCompositeOperation = "source-over";
        c.globalAlpha = 1;
        for (let i = 0; i < 3; i++) {
          const y = (h * (i * 0.33 + t * 0.025)) % h;
          c.drawImage(
            buffer,
            0,
            y,
            w,
            4,
            Math.sin(t * 11 + i) * w * 0.015,
            y,
            w,
            4,
          );
        }
        c.fillStyle = "#2e275428";
        for (let y = 0; y < h; y += 4) c.fillRect(0, y, w, 1);
        this.grain(c, w, h, t, "#fff", 0.13);
      } else {
        for (const side of [-1, 1]) {
          c.drawImage(buffer, side * w * 0.025, 0);
          const g = c.createLinearGradient(side < 0 ? 0 : w, 0, w * 0.5, 0);
          g.addColorStop(0, side < 0 ? "#fa83c2bb" : "#7de8f3bb");
          g.addColorStop(1, "#ffffff00");
          c.fillStyle = g;
          c.fillRect(0, 0, w, h);
        }
        c.globalCompositeOperation = "source-over";
        c.globalAlpha = 1;
        for (let i = 0; i < 3; i++) {
          c.save();
          c.translate(w * (0.15 + i * 0.35), h * 0.5);
          c.rotate(-0.35);
          const g = c.createLinearGradient(-w * 0.05, 0, w * 0.05, 0);
          g.addColorStop(0, "#fff0");
          g.addColorStop(0.5, "#ffffff22");
          g.addColorStop(1, "#fff0");
          c.fillStyle = g;
          c.fillRect(-w * 0.05, -h, w * 0.1, h * 2);
          c.restore();
        }
      }
    }
    if (id === "golden-hour" || id === "instant-film") {
      c.globalCompositeOperation = "soft-light";
      c.fillStyle = id === "golden-hour" ? "#efac69" : "#d7bba0";
      c.fillRect(0, 0, w, h);
      c.globalCompositeOperation = "screen";
      const g = c.createRadialGradient(
        w * 0.08,
        h * 0.1,
        0,
        w * 0.08,
        h * 0.1,
        w * 0.8,
      );
      g.addColorStop(0, id === "golden-hour" ? "#ffe3a85c" : "#ffd7b838");
      g.addColorStop(1, "#ffffff00");
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
      c.globalCompositeOperation = "source-over";
      this.grain(c, w, h, t, "#fff6e7", 0.07);
    }
    if (id === "film-noir") {
      this.vignette(c, w, h, 0.63);
      this.grain(c, w, h, t, "#fff", 0.16);
    }
    if (id === "cyanotype") {
      c.globalCompositeOperation = "screen";
      c.fillStyle = "#07172c";
      c.fillRect(0, 0, w, h);
      c.globalCompositeOperation = "source-over";
      this.grain(c, w, h, t, "#eaf4ff", 0.1);
    }
    c.restore();
  }
  vignette(c, w, h, strength) {
    const g = c.createRadialGradient(
      w * 0.5,
      h * 0.46,
      Math.min(w, h) * 0.15,
      w * 0.5,
      h * 0.5,
      Math.max(w, h) * 0.68,
    );
    g.addColorStop(0, "#0000");
    g.addColorStop(1, `rgba(0,10,5,${strength})`);
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  }
  grain(c, w, h, t, color, alpha) {
    c.save();
    c.fillStyle = color;
    c.globalAlpha = alpha;
    for (let i = 0; i < 420; i++) {
      const a = Math.sin(i * 127.1 + Math.floor(t * 12) * 0.7) * 43758.5453,
        b = Math.sin(i * 311.7 + Math.floor(t * 12)) * 9643.128;
      c.fillRect(
        (a - Math.floor(a)) * w,
        (b - Math.floor(b)) * h,
        1 + (i % 2),
        1,
      );
    }
    c.restore();
  }
  close() {
    this.scratch = null;
  }
}
export function lookOverlay(c, id, w, h, t, config) {
  if (!cinematicLooks.has(id)) return false;
  const u = Math.min(w, h) / 800,
    p = u * 30;
  c.save();
  c.textAlign = "left";
  c.fillStyle = "#fff";
  c.font = `600 ${Math.max(11, 16 * u)}px monospace`;
  if (id === "thermal") {
    c.fillText("ESPECTRO TÉRMICO / SIMULACIÓN", p, p + 20 * u);
    const g = c.createLinearGradient(0, h * 0.3, 0, h * 0.7);
    ["#fff9c2", "#ffbd37", "#f14f32", "#a21f8a", "#331d8f", "#0a1242"].forEach(
      (v, i) => g.addColorStop(i / 5, v),
    );
    c.fillStyle = g;
    c.fillRect(w - p - 14 * u, h * 0.3, 14 * u, h * 0.4);
    c.fillStyle = "#fff";
    c.textAlign = "right";
    c.fillText("ALTO", w - p - 24 * u, h * 0.3 + 12 * u);
    c.fillText("BAJO", w - p - 24 * u, h * 0.7);
  }
  if (id === "comic-pop") {
    c.save();
    c.translate(w * 0.78, h * 0.15);
    c.rotate(0.12);
    c.fillStyle = "#fff58b";
    c.beginPath();
    for (let i = 0; i < 24; i++) {
      const a = (i * Math.PI) / 12,
        r = (i % 2 ? 65 : 90) * u;
      c.lineTo(Math.cos(a) * r, Math.sin(a) * r * 0.6);
    }
    c.closePath();
    c.fill();
    c.fillStyle = "#262039";
    c.font = `900 ${35 * u}px Arial`;
    c.textAlign = "center";
    c.fillText("WOW!", 0, 12 * u);
    c.restore();
  }
  if (id === "vhs") {
    c.fillText("▶ PLAY   SP", p, p + 25 * u);
    c.textAlign = "right";
    c.fillText(
      `00:${String(Math.floor(t / 60) % 60).padStart(2, "0")}:${String(Math.floor(t) % 60).padStart(2, "0")}`,
      w - p,
      h - p,
    );
  }
  if (id === "film-noir") {
    c.fillStyle = "#0a0a0a";
    c.fillRect(0, 0, w, h * 0.07);
    c.fillRect(0, h * 0.93, w, h * 0.07);
    c.fillStyle = "#fff";
    c.textAlign = "center";
    c.font = `${16 * u}px Georgia,serif`;
    c.fillText("UN INSTANTE. TODA UNA PELÍCULA.", w / 2, h * 0.975);
  }
  if (id === "cyanotype") {
    c.strokeStyle = "#d8eaffaa";
    c.lineWidth = 1;
    c.strokeRect(p, p, w - p * 2, h - p * 2);
    c.fillText("BLUEPRINT / " + config.name, p + 12 * u, h - p - 14 * u);
  }
  if (id === "golden-hour") {
    c.font = `italic ${Math.max(20, 32 * u)}px Georgia,serif`;
    c.fillText("La luz de este momento.", p, h - p);
  }
  if (id === "instant-film") {
    const margin = Math.min(w, h) * 0.04;
    c.fillStyle = "#fffaf0";
    c.fillRect(0, 0, w, margin);
    c.fillRect(0, 0, margin, h);
    c.fillRect(w - margin, 0, margin, h);
    c.fillRect(0, h - margin * 3, w, margin * 3);
    c.fillStyle = "#5e5d50";
    c.font = `italic ${Math.max(17, 25 * u)}px Georgia,serif`;
    c.textAlign = "center";
    c.fillText(config.name, w / 2, h - margin * 1.1, w - margin * 2);
  }
  c.restore();
  return true;
}
