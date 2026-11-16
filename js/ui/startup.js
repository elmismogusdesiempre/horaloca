// Optional audio must never gate getUserMedia. On mobile, resume() can remain
// pending while the browser negotiates permissions or fullscreen transitions.
export function startCamera(camera, prepareSound = () => {}) {
  const opening = camera.start();
  try {
    Promise.resolve(prepareSound()).catch(() => {});
  } catch {
    // Camera remains usable when Web Audio is unavailable.
  }
  return opening;
}
