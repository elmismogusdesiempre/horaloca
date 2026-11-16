import { ellipse, gradient, path } from "../effects/art.js";
// A neutral illustrated fitting guide, never presented as a camera photograph.
export function guide(c, w, h) {
  c.fillStyle = gradient(c, 0, 0, w, h, ["#c9c1b7", "#ede6d9", "#babcae"]);
  c.fillRect(0, 0, w, h);
  c.save();
  c.translate(w * 0.5, h * 0.48);
  c.scale(w * 0.34, w * 0.34);
  c.fillStyle = gradient(c, -1, 0, 1, 1, ["#716676", "#313342"]);
  c.beginPath();
  c.ellipse(0, 1.3, 0.95, 0.8, 0, 0, Math.PI * 2);
  c.fill();
  path(
    c,
    [
      [-0.18, 0.42],
      [0.18, 0.42],
      [0.22, 0.78],
      [-0.22, 0.78],
    ],
    "#be9381",
  );
  ellipse(c, 0, -0.1, 0.53, 0.66, "#453734");
  ellipse(
    c,
    0,
    0.1,
    0.43,
    0.59,
    gradient(c, -0.4, 0, 0.4, 0.6, ["#c4937b", "#f1c7a3", "#bc8e78"]),
  );
  c.fillStyle = "#473a39";
  c.beginPath();
  c.moveTo(-0.43, -0.1);
  c.quadraticCurveTo(-0.5, -0.7, 0.05, -0.64);
  c.quadraticCurveTo(0.5, -0.6, 0.43, -0.05);
  c.quadraticCurveTo(0.23, -0.4, -0.05, -0.28);
  c.quadraticCurveTo(-0.3, -0.35, -0.43, -0.1);
  c.fill();
  for (const s of [-1, 1]) {
    ellipse(c, s * 0.19, 0.02, 0.035, 0.018, "#493e3c");
  }
  c.strokeStyle = "#af705f";
  c.lineWidth = 0.012;
  c.beginPath();
  c.moveTo(-0.1, 0.35);
  c.quadraticCurveTo(0, 0.41, 0.1, 0.35);
  c.stroke();
  c.restore();
  return [
    {
      x: w * 0.5,
      y: h * 0.48 + w * 0.34 * 0.02,
      width: w * 0.34 * 0.78,
      angle: 0,
      mouth: { x: w * 0.5, y: h * 0.48 + w * 0.34 * 0.35 },
      chin: { x: w * 0.5, y: h * 0.48 + w * 0.34 * 0.69 },
    },
  ];
}
