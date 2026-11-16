import test from "node:test";
import assert from "node:assert/strict";
import { startCamera } from "../js/ui/startup.js";
test("pending mobile AudioContext.resume never blocks camera startup", async () => {
  const calls = [];
  const camera = {
    start: () => {
      calls.push("camera");
      return Promise.resolve("ready");
    },
  };
  const sound = () => {
    calls.push("sound");
    return new Promise(() => {});
  };
  assert.equal(await startCamera(camera, sound), "ready");
  assert.deepEqual(calls, ["camera", "sound"]);
});
test("audio rejection or missing AudioContext does not prevent camera startup", async () => {
  for (const sound of [
    () => Promise.reject(new Error("audio denied")),
    () => {
      throw new Error("AudioContext unavailable");
    },
  ])
    assert.equal(await startCamera({ start: async () => true }, sound), true);
});
test("camera permission failure still propagates when sound is pending", async () => {
  await assert.rejects(
    startCamera(
      {
        start: async () => {
          throw new DOMException("Camera denied", "NotAllowedError");
        },
      },
      () => new Promise(() => {}),
    ),
    { name: "NotAllowedError" },
  );
});
