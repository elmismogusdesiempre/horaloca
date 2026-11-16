import test from "node:test";
import assert from "node:assert/strict";
import { Camera } from "../js/camera/camera.js";
import { Session } from "../js/ui/session.js";
import { Screensaver, slides } from "../js/ui/screensaver.js";
function media() {
  const tracks = [
    {
      readyState: "live",
      stop() {
        this.readyState = "ended";
      },
    },
    {
      readyState: "live",
      stop() {
        this.readyState = "ended";
      },
    },
  ];
  return { tracks, getTracks: () => tracks };
}
function video() {
  return {
    srcObject: null,
    paused: true,
    async play() {
      this.paused = false;
    },
    pause() {
      this.paused = true;
    },
  };
}
async function withMedia(getUserMedia, fn) {
  const desc = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { mediaDevices: { getUserMedia } },
  });
  try {
    await fn();
  } finally {
    if (desc) Object.defineProperty(globalThis, "navigator", desc);
    else delete globalThis.navigator;
  }
}
test("fourth capture releases every camera track before final flash, export and storage", async () => {
  const stream = media(),
    v = video(),
    camera = new Camera(v),
    events = [];
  let shots = 0;
  await withMedia(
    async () => stream,
    async () => {
      await camera.start();
      const session = new Session({
        choose: () => [[], [], [], []],
        sleep: async () => {},
        capture: async () => {
          assert.ok(stream.tracks.every((t) => t.readyState === "live"));
          return ++shots;
        },
        release: () => {
          events.push("stop");
          camera.stop();
        },
        onPhase: (p) => {
          if (p.phase === "flash" && p.index === 3) {
            events.push("last-flash");
            assert.ok(stream.tracks.every((t) => t.readyState === "ended"));
          }
        },
        finish: async () => {
          events.push("export");
          assert.equal(camera.stream, null);
          assert.equal(v.srcObject, null);
          assert.equal(v.paused, true);
        },
      });
      await session.run();
      assert.equal(shots, 4);
      assert.deepEqual(events, ["stop", "last-flash", "export"]);
    },
  );
});
test("errors in capture or export always release camera once", async () => {
  for (const failure of ["capture", "export"]) {
    let releases = 0;
    const session = new Session({
      choose: () => [[], [], [], []],
      sleep: async () => {},
      capture: async () => {
        if (failure === "capture") throw new Error("capture failed");
        return 1;
      },
      finish: async () => {
        throw new Error("export failed");
      },
      onPhase: () => {},
      release: () => releases++,
    });
    await assert.rejects(session.run(), /failed/);
    assert.equal(releases, 1);
    assert.equal(session.running, false);
  }
});
test("cancelled session releases camera without any further capture", async () => {
  let releases = 0,
    shots = 0;
  const session = new Session({
    choose: () => [[], [], [], []],
    sleep: async () => session.cancel(),
    capture: () => shots++,
    finish: () => {},
    onPhase: () => {},
    release: () => releases++,
  });
  await assert.rejects(session.run(), /cancelada/);
  assert.equal(shots, 0);
  assert.equal(releases, 1);
});
test("stopping while camera permission is pending stops late streams immediately", async () => {
  let resolve;
  const pending = new Promise((r) => (resolve = r)),
    stream = media(),
    v = video(),
    camera = new Camera(v);
  await withMedia(
    () => pending,
    async () => {
      const start = camera.start();
      camera.stop();
      resolve(stream);
      await assert.rejects(start, { name: "AbortError" });
      assert.ok(stream.tracks.every((t) => t.readyState === "ended"));
      assert.equal(camera.stream, null);
      assert.equal(v.srcObject, null);
    },
  );
});
test("video playback failure releases the newly acquired stream", async () => {
  const stream = media(),
    v = video(),
    camera = new Camera(v);
  v.play = async () => {
    throw new Error("play failed");
  };
  await withMedia(
    async () => stream,
    async () => {
      await assert.rejects(camera.start(), /play failed/);
      assert.ok(stream.tracks.every((t) => t.readyState === "ended"));
      assert.equal(camera.stream, null);
    },
  );
});
test("idle carousel loops four short slides and restarting does not duplicate timers or open camera", () => {
  let tick,
    timer = 0,
    stops = 0,
    opens = 0;
  const seen = [],
    camera = new Camera(video());
  const saver = new Screensaver((s, i) => seen.push(i), {
    schedule: (fn) => {
      tick = fn;
      return ++timer;
    },
    unschedule: () => stops++,
  });
  const desc = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: {
      mediaDevices: {
        getUserMedia: () => {
          opens++;
        },
      },
    },
  });
  try {
    saver.start();
    for (let i = 0; i < 4; i++) tick();
    assert.deepEqual(seen, [0, 1, 2, 3, 0]);
    saver.start();
    assert.equal(stops, 1);
    saver.stop();
    assert.equal(stops, 2);
    assert.equal(opens, 0);
    assert.equal(camera.stream, null);
    assert.equal(slides.length, 4);
  } finally {
    if (desc) Object.defineProperty(globalThis, "navigator", desc);
    else delete globalThis.navigator;
  }
});
test("another explicit start opens a fresh stream after the preceding stream was stopped", async () => {
  const a = media(),
    b = media(),
    camera = new Camera(video());
  let opens = 0;
  await withMedia(
    async () => (opens++ ? b : a),
    async () => {
      await camera.start();
      camera.stop();
      assert.equal(opens, 1);
      assert.ok(a.tracks.every((t) => t.readyState === "ended"));
      await camera.start();
      assert.equal(opens, 2);
      assert.equal(camera.stream, b);
      camera.stop();
      assert.ok(b.tracks.every((t) => t.readyState === "ended"));
    },
  );
});
test("stopping during pending video playback releases hardware before play resolves", async () => {
  let played;
  const pending = new Promise((r) => (played = r)),
    stream = media(),
    v = video(),
    camera = new Camera(v);
  v.play = () => pending;
  await withMedia(
    async () => stream,
    async () => {
      const start = camera.start();
      await Promise.resolve();
      camera.stop();
      assert.ok(stream.tracks.every((t) => t.readyState === "ended"));
      assert.equal(v.srcObject, null);
      played();
      await assert.rejects(start, { name: "AbortError" });
    },
  );
});
test("five consecutive sessions leave all streams ended and idle between explicit starts", async () => {
  const streams = [],
    v = video(),
    camera = new Camera(v);
  await withMedia(
    async () => {
      const stream = media();
      streams.push(stream);
      return stream;
    },
    async () => {
      for (let i = 0; i < 5; i++) {
        await camera.start();
        const session = new Session({
          choose: () => [[], [], [], []],
          sleep: async () => {},
          capture: async () => 1,
          onPhase: () => {},
          release: () => camera.stop(),
          finish: async () => assert.equal(camera.stream, null),
        });
        await session.run();
        assert.ok(
          streams.every((s) => s.tracks.every((t) => t.readyState === "ended")),
        );
        assert.equal(v.srcObject, null);
      }
      assert.equal(streams.length, 5);
    },
  );
});
