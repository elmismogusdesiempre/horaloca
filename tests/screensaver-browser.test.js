import test from "node:test";
import assert from "node:assert/strict";
import { Screensaver } from "../js/ui/screensaver.js";

test("default timers preserve the Window receiver required by browser host APIs", () => {
  const originalSet = globalThis.setInterval,
    originalClear = globalThis.clearInterval;
  let callback,
    active = 0;
  globalThis.setInterval = function (fn) {
    if (this !== globalThis) throw new TypeError("Illegal invocation");
    callback = fn;
    active++;
    return 123;
  };
  globalThis.clearInterval = function (id) {
    if (this !== globalThis) throw new TypeError("Illegal invocation");
    assert.equal(id, 123);
    active--;
  };
  try {
    const seen = [],
      saver = new Screensaver((slide, index) => seen.push(index));
    saver.start();
    assert.equal(active, 1);
    callback();
    assert.deepEqual(seen, [0, 1]);
    saver.start();
    assert.equal(active, 1);
    saver.stop();
    assert.equal(active, 0);
  } finally {
    globalThis.setInterval = originalSet;
    globalThis.clearInterval = originalClear;
  }
});

test("unavailable carousel timer falls back to a static slide without blocking initialization", () => {
  const seen = [];
  const saver = new Screensaver((slide, index) => seen.push(index), {
    schedule: () => {
      throw new TypeError("timer unavailable");
    },
  });
  assert.doesNotThrow(() => saver.start());
  assert.deepEqual(seen, [0]);
  assert.equal(saver.timer, null);
});
