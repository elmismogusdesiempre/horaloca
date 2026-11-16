import test from "node:test";
import assert from "node:assert/strict";
import { Tracker } from "../js/tracking/tracker.js";
function face(x) {
  const points = Array.from({ length: 478 }, () => ({ x, y: 0.4, z: 0 }));
  points[33] = { x: x - 0.05, y: 0.4 };
  points[263] = { x: x + 0.05, y: 0.4 };
  points[10] = { x, y: 0.25 };
  points[152] = { x, y: 0.68 };
  points[13] = { x, y: 0.54 };
  points[1] = { x, y: 0.47 };
  return points;
}
test("landmarks map to the same mirrored crop as camera; missing detection clears all faces", () => {
  const t = new Tracker();
  t.ready = true;
  t.model = { detectForVideo: () => ({ faceLandmarks: [face(0.3)] }) };
  const video = {
    readyState: 4,
    videoWidth: 1280,
    videoHeight: 720,
    currentTime: 1,
  };
  const f = t.update(video, 1280, 960, 1000)[0];
  assert.ok(f.x > 640);
  assert.ok(Math.abs(f.angle) < 0.001);
  assert.ok(f.width > 0);
  t.model.detectForVideo = () => ({ faceLandmarks: [] });
  video.currentTime = 2;
  assert.deepEqual(t.update(video, 1280, 960, 1200), []);
});
test("reordered detections associate by nearest face instead of array index", () => {
  const t = new Tracker();
  t.ready = true;
  let landmarks = [face(0.2), face(0.8)];
  t.model = { detectForVideo: () => ({ faceLandmarks: landmarks }) };
  const video = {
    readyState: 4,
    videoWidth: 1280,
    videoHeight: 960,
    currentTime: 1,
  };
  t.update(video, 1280, 960, 1000);
  landmarks = [face(0.79), face(0.21)];
  video.currentTime = 2;
  const result = t.update(video, 1280, 960, 1200);
  assert.ok(result[0].x < 400);
  assert.ok(result[1].x > 900);
});
