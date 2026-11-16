import test from "node:test";
import assert from "node:assert/strict";
import { createCanvas } from "@napi-rs/canvas";
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { catalog } from "../js/effects/catalog.js";
import { EffectsEngine } from "../js/effects/engine.js";
import { guide } from "../js/ui/guide.js";
import { makeCollage } from "../js/collage/collage.js";
const config = {
  name: "La noche es nuestra",
  text: "Cuatro momentos. Una gran historia.",
  color: "#bdff41",
  secondary: "#e76bfa",
  quality: 0.94,
  date: true,
};
test("all 72 effects render actual different pixels; produce QA contact sheet", () => {
  mkdirSync("work", { recursive: true });
  const sheet = createCanvas(1600, Math.ceil(catalog.length / 4) * 330),
    sc = sheet.getContext("2d"),
    engine = new EffectsEngine({ canvasFactory: createCanvas }),
    hashes = new Set();
  catalog.forEach((e, i) => {
    const c = createCanvas(800, 600),
      ctx = c.getContext("2d"),
      faces = guide(ctx, 800, 600);
    engine.render(ctx, 800, 600, [e.id], faces, 3, config);
    const png = c.toBuffer("image/png");
    hashes.add(createHash("sha256").update(png).digest("hex"));
    const x = (i % 4) * 400,
      y = Math.floor(i / 4) * 330;
    sc.drawImage(c, x, y, 400, 300);
    sc.fillStyle = "#f7f6f2";
    sc.fillRect(x, y + 300, 400, 30);
    sc.fillStyle = "#222";
    sc.font = "14px sans-serif";
    sc.fillText(e.name, x + 10, y + 320);
  });
  assert.equal(hashes.size, 72);
  writeFileSync("work/effects-contact-sheet.png", sheet.toBuffer("image/png"));
});
test("both collage layouts export full resolution JPEGs from four actual canvases", async () => {
  const original = globalThis.document;
  globalThis.document = {
    createElement: () => {
      const c = createCanvas(1, 1);
      c.toBlob = (callback) => callback(new Blob([c.toBuffer("image/jpeg")]));
      return c;
    },
  };
  try {
    const photos = Array.from({ length: 4 }, (_, i) => {
      const c = createCanvas(1280, 960),
        ctx = c.getContext("2d");
      guide(ctx, 1280, 960);
      new EffectsEngine({ canvasFactory: createCanvas }).render(
        ctx,
        1280,
        960,
        ["confetti", "top-hat"],
        [
          {
            x: 640,
            y: 460,
            width: 340,
            angle: 0,
            mouth: { x: 640, y: 520 },
            chin: { x: 640, y: 640 },
          },
        ],
        i + 1,
        config,
      );
      return c;
    });
    for (const layout of ["grid", "strip"]) {
      const result = await makeCollage(photos, { ...config, layout });
      assert.equal(result.canvas.width, layout === "grid" ? 2400 : 1200);
      assert.equal(result.canvas.height, layout === "grid" ? 2200 : 3600);
      assert.ok(result.blob.size > 100000);
      writeFileSync(
        `work/collage-${layout}.jpg`,
        Buffer.from(await result.blob.arrayBuffer()),
      );
    }
    await assert.rejects(makeCollage(photos.slice(0, 3), config));
  } finally {
    globalThis.document = original;
  }
});
