import test from "node:test";
import assert from "node:assert/strict";
import { GuestFlow } from "../js/ui/guest-flow.js";
import { Session } from "../js/ui/session.js";
test("fourth photo stops hardware then shows processing/result; idle only after another round", async () => {
  let active = true,
    slides = false;
  const screens = [];
  const flow = new GuestFlow({
    release: () => {
      active = false;
    },
    render: (state) => {
      screens.push(state);
      slides = state === "idle";
    },
  });
  flow.start();
  const session = new Session({
    choose: () => [[], [], [], []],
    sleep: async () => {},
    onPhase: () => {},
    capture: async () => {
      assert.equal(active, true);
      return 1;
    },
    release: () => flow.captured(),
    finish: async () => {
      assert.equal(active, false);
      assert.equal(slides, false);
      assert.equal(flow.state, "processing");
      flow.result();
      assert.equal(slides, false);
    },
  });
  await session.run();
  assert.deepEqual(screens, ["capturing", "processing", "result"]);
  assert.equal(flow.state, "result");
  assert.equal(active, false);
  flow.idle();
  assert.equal(slides, true);
  assert.equal(active, false);
});
test("release during result never replaces the photo with the screensaver", () => {
  const screens = [];
  const flow = new GuestFlow({
    release: () => {},
    render: (s) => screens.push(s),
  });
  flow.start();
  flow.captured();
  flow.result();
  flow.captured();
  assert.equal(flow.state, "result");
  assert.deepEqual(screens, ["capturing", "processing", "result"]);
});
test("cancellation followed by idle cannot reopen a late result", () => {
  const flow = new GuestFlow({ release: () => {}, render: () => {} });
  flow.start();
  flow.captured();
  flow.idle();
  flow.result();
  assert.equal(flow.state, "idle");
});
