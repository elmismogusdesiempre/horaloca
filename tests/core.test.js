import test from "node:test";
import assert from "node:assert/strict";
import { catalog } from "../js/effects/catalog.js";
import { compositions, compatible } from "../js/effects/selection.js";
import { Session } from "../js/ui/session.js";
test("72 unique effects with required theme coverage", () => {
  assert.equal(catalog.length, 72);
  assert.equal(new Set(catalog.map((e) => e.id)).size, 72);
  for (const theme of ["fiesta", "boda", "quince", "cine", "empresa"])
    assert.ok(
      catalog.filter((e) => e.theme === theme).length >=
        (theme === "fiesta" ? 20 : 10),
    );
});
test("random sessions only use authorized effects, compatible layers and unique compositions", () => {
  const ids = catalog.map((e) => e.id);
  for (let n = 0; n < 500; n++) {
    const allowed = ids.filter(() => Math.random() > 0.7),
      set = new Set(allowed);
    if (!allowed.length) continue;
    const session = compositions(allowed);
    assert.equal(session.length, 4);
    for (const shot of session) {
      assert.ok(shot.length <= 3);
      for (const id of shot) assert.ok(set.has(id));
      const effects = shot.map((id) => catalog.find((e) => e.id === id));
      for (let i = 0; i < effects.length; i++)
        for (let j = i + 1; j < effects.length; j++)
          assert.ok(compatible(effects[i], effects[j]));
    }
    if (allowed.length >= 4)
      assert.equal(new Set(session.map((s) => s.join("|"))).size, 4);
  }
});
test("fallback excludes all face accessories", () => {
  for (const shot of compositions(
    catalog.map((e) => e.id),
    { tracking: false },
  ))
    for (const id of shot)
      assert.equal(catalog.find((e) => e.id === id).requiresTracking, false);
  assert.throws(() => compositions(["top-hat"], { tracking: false }));
});
test("single authorized effect is reused honestly and invalid IDs rejected", () => {
  assert.deepEqual(
    compositions(["confetti", "confetti", "invalid"]),
    Array.from({ length: 4 }, () => ["confetti"]),
  );
  assert.throws(() => compositions(["invalid"]));
});
test("previous compositions are avoided when alternatives exist", () => {
  const ids = [
    "confetti",
    "top-hat",
    "king",
    "queen",
    "bunny",
    "horns",
    "afro",
    "wig",
  ];
  const a = compositions(ids),
    prev = a.map((s) => [...s].sort().join("|"));
  for (const s of compositions(ids, { previous: prev }))
    assert.ok(!prev.includes([...s].sort().join("|")));
});
test("one start gives 5 preparation beats, four independent 3-2-1 countdowns and four captures", async () => {
  const phases = [],
    photos = [];
  let done = false;
  const s = new Session({
    choose: () => [["a"], ["b"], ["c"], ["d"]],
    onPhase: (p) => phases.push(p),
    capture: async () => {
      photos.push(photos.length);
      return photos.length;
    },
    sleep: async () => {},
    finish: async (p) => {
      assert.equal(p.length, 4);
      done = true;
    },
  });
  const running = s.run();
  assert.equal(await s.run(), false);
  assert.equal(await running, true);
  assert.equal(done, true);
  assert.equal(photos.length, 4);
  assert.deepEqual(
    phases.filter((p) => p.phase === "countdown").map((p) => p.number),
    [3, 2, 1, 3, 2, 1, 3, 2, 1, 3, 2, 1],
  );
  assert.equal(phases.filter((p) => p.phase === "prepare").length, 5);
  assert.equal(s.running, false);
});
test("capture failure unlocks the session and does not finish incomplete collage", async () => {
  let finished = false;
  const s = new Session({
    choose: () => [[], [], [], []],
    onPhase: () => {},
    sleep: async () => {},
    capture: async () => {
      throw new Error("camera lost");
    },
    finish: () => {
      finished = true;
    },
  });
  await assert.rejects(s.run(), /camera lost/);
  assert.equal(s.running, false);
  assert.equal(finished, false);
});
test("cancel prevents further capture", async () => {
  let shots = 0;
  const s = new Session({
    choose: () => [[], [], [], []],
    onPhase: () => {},
    sleep: async () => s.cancel(),
    capture: () => shots++,
    finish: () => {},
  });
  await assert.rejects(s.run(), /cancelada/);
  assert.equal(shots, 0);
});
