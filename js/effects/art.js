import { rose, floralCrown, jewelledTiara } from "./botanical.js";
// Original vector artwork. Coordinates are normalized to the tracked face width.
const TAU = Math.PI * 2;
export function path(c, points, fill, stroke) {
  c.beginPath();
  points.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.closePath();
  if (fill) {
    c.fillStyle = fill;
    c.fill();
  }
  if (stroke) {
    c.strokeStyle = stroke;
    c.stroke();
  }
}
export function ellipse(c, x, y, rx, ry, fill, stroke) {
  c.beginPath();
  c.ellipse(x, y, rx, ry, 0, 0, TAU);
  if (fill) {
    c.fillStyle = fill;
    c.fill();
  }
  if (stroke) {
    c.strokeStyle = stroke;
    c.stroke();
  }
}
export function star(c, x, y, r, fill, n = 5) {
  path(
    c,
    Array.from({ length: n * 2 }, (_, i) => {
      const a = (i * Math.PI) / n - Math.PI / 2,
        rr = i % 2 ? r * 0.43 : r;
      return [x + Math.cos(a) * rr, y + Math.sin(a) * rr];
    }),
    fill,
  );
}
export function gradient(c, x, y, x2, y2, colors) {
  const g = c.createLinearGradient(x, y, x2, y2);
  colors.forEach((v, i) => g.addColorStop(i / (colors.length - 1), v));
  return g;
}
function flower(c, x, y, r, color = "#fff6e9") {
  rose(c, x, y, r, /f2|edb|f5c|cfce/i.test(color) ? "blush" : "ivory");
}
function gem(c, x, y, r, color = "#ccf5ff") {
  path(
    c,
    [
      [x - r, y],
      [x - r * 0.45, y - r * 0.7],
      [x + r * 0.45, y - r * 0.7],
      [x + r, y],
      [x, y + r],
    ],
    gradient(c, x - r, y - r, x + r, y + r, ["#fff", color, "#587fbd"]),
  );
  path(
    c,
    [
      [x - r, y],
      [x + r, y],
      [x, y + r],
    ],
    null,
    "#ffffff88",
  );
}
function feather(c, x, y, s, color) {
  c.save();
  c.translate(x, y);
  c.rotate(-0.45);
  c.fillStyle = gradient(c, 0, -s, 0, 0, [color, "#302141"]);
  c.beginPath();
  c.moveTo(0, 0);
  c.bezierCurveTo(-s * 0.6, -s * 0.3, -s * 0.4, -s, 0, -s);
  c.bezierCurveTo(s * 0.4, -s, s * 0.5, -s * 0.3, 0, 0);
  c.fill();
  c.strokeStyle = "#ffffff66";
  c.lineWidth = 0.004;
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(0, -s * 0.9);
  c.stroke();
  c.restore();
}
export function accessory(c, id, t, color) {
  c.lineWidth = 0.012;
  c.lineJoin = "round";
  const gold = gradient(c, -0.5, -0.5, 0.5, 0.1, [
    "#80531c",
    "#fff0a6",
    "#c78b32",
    "#fff2b9",
  ]);
  const silk = gradient(c, -0.4, -0.5, 0.4, 0.1, [
    "#14152c",
    "#55516c",
    "#131421",
  ]);
  c.shadowColor = "#0008";
  c.shadowBlur = 0.045;
  c.shadowOffsetY = 0.015;
  switch (id) {
    case "top-hat":
      ellipse(c, 0, -0.32, 0.64, 0.095, silk, "#b8a1cb");
      path(
        c,
        [
          [-0.34, -0.36],
          [-0.3, -0.91],
          [0.3, -0.91],
          [0.34, -0.36],
        ],
        silk,
        "#82718c",
      );
      ellipse(c, 0, -0.91, 0.3, 0.055, "#2b283e", "#82718c");
      path(
        c,
        [
          [-0.33, -0.46],
          [0.33, -0.46],
          [0.33, -0.36],
          [-0.33, -0.36],
        ],
        gradient(c, -0.3, 0, 0.3, 0, ["#942e6d", "#ef8dbe", "#942e6d"]),
      );
      feather(c, 0.26, -0.47, 0.48, "#72e8de");
      break;
    case "party-hat":
      path(
        c,
        [
          [-0.38, -0.35],
          [0, -1.04],
          [0.38, -0.35],
        ],
        gradient(c, -0.3, -1, 0.3, -0.3, ["#c06bfa", "#452d85", "#ed9ded"]),
        "#ffc8fb",
      );
      for (let i = 0; i < 5; i++) {
        const y = -0.43 - i * 0.105,
          rx = 0.31 - i * 0.048;
        ellipse(
          c,
          Math.sin(i * 2 + t) * rx,
          y,
          0.025,
          0.025,
          i % 2 ? color : "#fff2bd",
        );
      }
      ellipse(c, 0, -1.04, 0.065, 0.065, "#fff5c4");
      break;
    case "cowboy":
      c.fillStyle = gradient(c, 0, -0.8, 0, -0.2, ["#c78e50", "#6b3e26"]);
      c.beginPath();
      c.moveTo(-0.65, -0.45);
      c.bezierCurveTo(-0.65, -0.15, 0.65, -0.15, 0.65, -0.45);
      c.bezierCurveTo(0.3, -0.35, 0.3, -0.45, 0.28, -0.76);
      c.quadraticCurveTo(0, -0.9, -0.28, -0.76);
      c.bezierCurveTo(-0.3, -0.45, -0.3, -0.35, -0.65, -0.45);
      c.fill();
      path(
        c,
        [
          [-0.29, -0.49],
          [0.29, -0.49],
          [0.3, -0.4],
          [-0.3, -0.4],
        ],
        "#442b24",
      );
      c.setLineDash([0.025, 0.018]);
      c.strokeStyle = "#efc293";
      c.stroke();
      c.setLineDash([]);
      break;
    case "pirate":
      c.fillStyle = silk;
      c.beginPath();
      c.moveTo(-0.65, -0.4);
      c.quadraticCurveTo(-0.65, -0.89, -0.28, -0.68);
      c.quadraticCurveTo(0, -1.1, 0.28, -0.68);
      c.quadraticCurveTo(0.65, -0.89, 0.65, -0.4);
      c.quadraticCurveTo(0, -0.22, -0.65, -0.4);
      c.fill();
      c.strokeStyle = gold;
      c.lineWidth = 0.035;
      c.stroke();
      star(c, 0, -0.61, 0.1, "#efe2b8", 4);
      break;
    case "queen":
    case "sparkle-crown":
    case "tiara":
      jewelledTiara(c, id, t);
      break;
    case "king":
      for (let i = -2; i <= 2; i++) {
        const x = i * 0.16,
          peak = -0.65 - (2 - Math.abs(i)) * 0.08;
        path(
          c,
          [
            [x - 0.13, -0.33],
            [x, peak],
            [x + 0.13, -0.33],
          ],
          gold,
          "#f7d386",
        );
        gem(c, x, peak, 0.033, color);
      }
      path(
        c,
        [
          [-0.44, -0.38],
          [0.44, -0.38],
          [0.42, -0.28],
          [-0.42, -0.28],
        ],
        gold,
      );
      for (let i = -2; i <= 2; i++) gem(c, i * 0.16, -0.33, 0.028);
      break;
    case "giant-glasses":
    case "heart-glasses":
    case "visor":
    case "carnival": {
      c.shadowBlur = 0.025;
      if (id === "visor") {
        path(
          c,
          [
            [-0.58, -0.15],
            [0.58, -0.15],
            [0.52, 0.12],
            [0.18, 0.17],
            [0, 0.06],
            [-0.18, 0.17],
            [-0.52, 0.12],
          ],
          gradient(c, 0, -0.15, 0, 0.17, [
            "#b5fffa99",
            "#7424b9aa",
            "#080c49dd",
          ]),
          "#9dfaff",
        );
        c.fillStyle = "#d7ffff";
        c.fillRect(-0.5, -0.11, (Math.sin(t * 2) + 1) * 0.45, 0.012);
        break;
      }
      if (id === "carnival") {
        for (let i = -1; i <= 1; i += 2) {
          feather(c, i * 0.48, -0.1, 0.36, i < 0 ? "#e96bca" : "#69d2d4");
          path(
            c,
            [
              [0, -0.08],
              [i * 0.45, -0.24],
              [i * 0.62, 0.04],
              [i * 0.28, 0.2],
              [0, 0.03],
            ],
            gradient(c, -0.5, 0, 0.5, 0, ["#2c9fa5", "#262344", "#bf51ad"]),
            gold,
          );
        }
      }
      for (const sign of [-1, 1]) {
        c.save();
        c.translate(sign * 0.27, 0);
        if (id === "heart-glasses") {
          c.beginPath();
          c.moveTo(0, 0.19);
          c.bezierCurveTo(-0.5, -0.1, -0.15, -0.35, 0, -0.14);
          c.bezierCurveTo(0.15, -0.35, 0.5, -0.1, 0, 0.19);
        } else {
          c.beginPath();
          c.roundRect(-0.23, -0.16, 0.46, 0.33, 0.12);
        }
        c.fillStyle = gradient(c, 0, -0.2, 0, 0.2, ["#192845bb", "#8be5f344"]);
        c.fill();
        c.strokeStyle =
          id === "carnival"
            ? gold
            : gradient(c, -0.2, -0.2, 0.2, 0.2, [color, "#fff", color]);
        c.lineWidth = id === "carnival" ? 0.025 : 0.045;
        c.stroke();
        c.beginPath();
        c.moveTo(-0.14, -0.1);
        c.lineTo(0.07, -0.1);
        c.strokeStyle = "#ffffffaa";
        c.lineWidth = 0.014;
        c.stroke();
        c.restore();
      }
      c.beginPath();
      c.moveTo(-0.06, 0);
      c.quadraticCurveTo(0, -0.07, 0.06, 0);
      c.strokeStyle = id === "carnival" ? gold : color;
      c.lineWidth = 0.03;
      c.stroke();
      break;
    }
    case "mustache":
    case "wild-mustache":
      for (const sign of [-1, 1]) {
        c.save();
        c.scale(sign, 1);
        c.fillStyle = gradient(c, 0, -0.02, 0, 0.12, ["#574039", "#140e16"]);
        c.beginPath();
        c.moveTo(0, 0);
        c.bezierCurveTo(0.13, -0.09, 0.22, 0.12, 0.34, -0.06);
        c.bezierCurveTo(
          id === "wild-mustache" ? 0.54 : 0.35,
          id === "wild-mustache" ? -0.25 : 0.1,
          0.21,
          0.23,
          0,
          0.07,
        );
        c.fill();
        c.restore();
      }
      break;
    case "tie":
      c.rotate(Math.sin(t * 2) * 0.07);
      path(
        c,
        [
          [-0.1, 0],
          [0.1, 0],
          [0.06, 0.13],
          [-0.06, 0.13],
        ],
        color,
      );
      path(
        c,
        [
          [-0.06, 0.12],
          [0.06, 0.12],
          [0.15, 0.6],
          [0, 0.76],
          [-0.15, 0.6],
        ],
        gradient(c, -0.1, 0, 0.15, 0.7, [color, "#fff0fa", "#7c2889"]),
      );
      for (let i = 0; i < 5; i++)
        path(
          c,
          [
            [-0.08, 0.2 + i * 0.08],
            [0.08, 0.26 + i * 0.08],
            [0.09, 0.3 + i * 0.08],
            [-0.09, 0.24 + i * 0.08],
          ],
          "#ffffff44",
        );
      break;
    case "bow":
      for (const sign of [-1, 1]) {
        path(
          c,
          [
            [0, 0],
            [sign * 0.37, -0.16],
            [sign * 0.34, 0.2],
            [0, 0.06],
          ],
          gradient(c, 0, 0, sign * 0.4, 0, [color, "#753c92", "#ffb5de"]),
        );
        path(
          c,
          [
            [sign * 0.06, 0.02],
            [sign * 0.28, -0.07],
            [sign * 0.22, 0.04],
            [sign * 0.29, 0.12],
          ],
          "#ffffff33",
        );
      }
      ellipse(c, 0, 0.02, 0.075, 0.09, color);
      break;
    case "afro":
      for (let i = 0; i < 50; i++) {
        const a = i * 2.4,
          r = 0.12 + Math.sqrt(i / 50) * 0.47;
        ellipse(
          c,
          Math.cos(a) * r,
          Math.sin(a) * r * 0.7 - 0.53,
          0.115,
          0.105,
          gradient(c, -0.6, -1, 0.5, 0, ["#6c4530", "#231a23", "#513528"]),
        );
      }
      break;
    case "wig":
      for (let i = 0; i < 22; i++) {
        const x = (i - 10.5) * 0.048,
          side = Math.abs(x) > 0.3,
          end = side ? 0.4 : -0.27 + Math.sin(i * 0.4) * 0.05;
        path(
          c,
          [
            [x, -0.65],
            [x + 0.07, -0.57],
            [x + 0.08, end],
            [x + 0.02, end + 0.04],
            [x - 0.04, -0.45],
          ],
          gradient(c, x, -0.7, x + 0.1, 0.4, [
            i % 2 ? "#84eeed" : "#d692ef",
            i % 3 ? "#7548a6" : "#ec8ac6",
            "#252244",
          ]),
        );
      }
      break;
    case "bunny":
      for (const sign of [-1, 1]) {
        c.save();
        c.translate(sign * 0.23, -0.43);
        c.rotate(sign * 0.19 + Math.sin(t) * 0.025);
        ellipse(c, 0, -0.34, 0.125, 0.4, "#f6f1e9", "#c6b9cd");
        ellipse(
          c,
          0,
          -0.34,
          0.065,
          0.31,
          gradient(c, 0, -0.6, 0, 0, ["#e3a4bf", "#ffdae7"]),
        );
        c.restore();
      }
      break;
    case "horns":
      for (const s of [-1, 1]) {
        c.fillStyle = gradient(c, s * 0.2, -0.8, s * 0.4, -0.2, [
          "#ffe1cc",
          "#ee4664",
          "#761433",
        ]);
        c.beginPath();
        c.moveTo(s * 0.18, -0.32);
        c.quadraticCurveTo(s * 0.55, -0.45, s * 0.4, -0.95);
        c.quadraticCurveTo(s * 0.29, -0.63, s * 0.1, -0.48);
        c.fill();
      }
      break;
    case "flower-crown":
      floralCrown(c);
      break;
    case "orbit-stars":
      for (let i = 0; i < 7; i++) {
        const a = (i * TAU) / 7 + t * 0.45;
        star(
          c,
          Math.cos(a) * 0.67,
          -0.25 + Math.sin(a) * 0.48,
          0.035 + 0.015 * Math.sin(t + i),
          "#fff4a9",
        );
      }
      break;
  }
  c.shadowBlur = 0;
  c.shadowOffsetY = 0;
}
export { flower };
