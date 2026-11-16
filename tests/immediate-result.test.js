import test from "node:test";
import assert from "node:assert/strict";
import { createCanvas } from "@napi-rs/canvas";
import { composeCollage, exportCollage } from "../js/collage/collage.js";
import { Session } from "../js/ui/session.js";
import {
  catalog,
  themes,
  recommended,
  effectsForTheme,
} from "../js/effects/catalog.js";
test("collage pixels are ready without waiting for or even starting JPEG encoding", async () => {
  const original = globalThis.document;
  let encode = 0,
    complete;
  globalThis.document = {
    createElement: () => {
      const c = createCanvas(1, 1);
      c.toBlob = (fn) => {
        encode++;
        complete = fn;
      };
      return c;
    },
  };
  try {
    const photos = Array.from({ length: 4 }, () => createCanvas(400, 300)),
      canvas = composeCollage(photos, {
        layout: "strip",
        name: "Mi fiesta",
        color: "#bdff41",
      });
    assert.equal(canvas.width, 1200);
    assert.equal(canvas.height, 3600);
    assert.equal(encode, 0);
    const pending = exportCollage(canvas, { quality: 0.94 });
    assert.equal(encode, 1);
    complete(new Blob(["jpeg"]));
    assert.ok(await pending);
  } finally {
    globalThis.document = original;
  }
});
test("fourth flash has no artificial sleep before delivering the result", async () => {
  let shot = 0;
  const after = [];
  const s = new Session({
    choose: () => [[], [], [], []],
    capture: async () => ++shot,
    onPhase: (p) => {
      if (shot === 4) after.push(p.phase);
    },
    release: () => after.push("release"),
    sleep: async () => {
      if (shot === 4) after.push("sleep");
    },
    finish: async () => after.push("result"),
  });
  await s.run();
  assert.deepEqual(after, ["release", "flash", "result"]);
});
test("birthday, wedding and quince categories provide valid authorized selections without duplicating catalog effects", () => {
  for (const theme of ["cumpleanos", "boda", "quince"]) {
    assert.ok(themes[theme]);
    const ids = recommended(theme);
    assert.ok(ids.length >= 10);
    assert.ok(ids.every((id) => catalog.some((e) => e.id === id)));
    assert.deepEqual(
      ids,
      effectsForTheme(theme).map((e) => e.id),
    );
  }
  assert.equal(catalog.length, 72);
});
