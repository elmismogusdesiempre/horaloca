// Match the drawing buffer to the visible camera, so landmarks and captures use
// the very same crop in portrait and landscape. Never stretch a 4:3 image to fit.
export function viewportSize(width, height, longest = 1600) {
  const scale = longest / Math.max(1, width, height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}
export const posePrompts = [
  "¡Sonrían!",
  "¡Hagan su mejor pose!",
  "¡Ahora una cara de locura!",
  "¡Todos juntos, una última!",
];
export function fitViewport(canvas, width, height) {
  const size = viewportSize(width, height);
  if (canvas.width !== size.width || canvas.height !== size.height) {
    canvas.width = size.width;
    canvas.height = size.height;
  }
  return size;
}
