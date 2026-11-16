import test from "node:test";
import assert from "node:assert/strict";
import { createCanvas } from "@napi-rs/canvas";
import { EffectsEngine } from "../js/effects/engine.js";
import { viewportSize, posePrompts } from "../js/ui/viewport.js";
const config = {
  name: "La noche es nuestra",
  color: "#bdff41",
  secondary: "#e76bfa",
};
function rendered(id) {
  const c = createCanvas(800, 600),
    ctx = c.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, 800, 600);
  g.addColorStop(0, "#365f9a");
  g.addColorStop(1, "#edba79");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 800, 600);
  new EffectsEngine({ canvasFactory: createCanvas }).render(
    ctx,
    800,
    600,
    [id],
    [],
    3,
    config,
  );
  return ctx.getImageData(400, 300, 1, 1).data;
}
test("CCTV and spy change camera pixels to green phosphor, not just text overlay", () => {
  for (const id of ["security", "spy"]) {
    const [r, g, b] = rendered(id);
    assert.ok(g > r * 1.5, `${id}: ${r},${g},${b}`);
    assert.ok(g > b, `${id}: expected green channel dominance`);
  }
});
test("noir removes chroma and thermal remaps luminance to false-color spectrum", () => {
  const [r, g, b] = rendered("film-noir");
  assert.ok(Math.abs(r - g) < 2 && Math.abs(g - b) < 2);
  const thermal = rendered("thermal");
  assert.ok(thermal[0] > thermal[2]);
  assert.ok(thermal[3] === 255);
});
test("camera buffer matches portrait and landscape without stretching", () => {
  for (const [w, h] of [
    [1920, 1080],
    [820, 1180],
    [390, 844],
    [1024, 768],
  ]) {
    const size = viewportSize(w, h);
    assert.ok(Math.abs(size.width / size.height - w / h) < 0.002);
    assert.equal(Math.max(size.width, size.height), 1600);
  }
  assert.equal(posePrompts.length, 4);
  assert.equal(new Set(posePrompts).size, 4);
});
