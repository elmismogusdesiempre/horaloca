// Original botanical artwork: layered petals, veined eucalyptus and pearl settings.
const TAU = Math.PI * 2;
function grad(c, x, y, r, stops) {
  const g = c.createRadialGradient(x - r * 0.22, y - r * 0.3, 0, x, y, r);
  stops.forEach((color, i) => g.addColorStop(i / (stops.length - 1), color));
  return g;
}
export function rose(c, x, y, r, palette = "ivory", angle = 0) {
  const colors =
    palette === "blush"
      ? ["#fff1eb", "#efb7b7", "#b9667d"]
      : ["#fffffa", "#f3e6d0", "#c7ad8b"];
  c.save();
  c.translate(x, y);
  c.rotate(angle);
  c.shadowColor = "#54422c26";
  c.shadowBlur = r * 0.16;
  c.shadowOffsetY = r * 0.07;
  for (let ring = 0; ring < 4; ring++) {
    const n = ring === 0 ? 7 : 6,
      rr = r * (1 - ring * 0.21);
    for (let i = 0; i < n; i++) {
      c.save();
      c.rotate((i * TAU) / n + ring * 0.48);
      c.fillStyle = grad(c, 0, -rr * 0.2, rr, colors);
      c.beginPath();
      c.moveTo(0, rr * 0.24);
      c.bezierCurveTo(
        -rr * 0.86,
        rr * 0.25,
        -rr * 0.72,
        -rr * 0.8,
        -rr * 0.1,
        -rr,
      );
      c.bezierCurveTo(
        rr * 0.6,
        -rr * 1.12,
        rr * 0.82,
        -rr * 0.22,
        0,
        rr * 0.24,
      );
      c.fill();
      c.shadowBlur = 0;
      c.strokeStyle = palette === "blush" ? "#fff7f04a" : "#ffffff88";
      c.lineWidth = r * 0.013;
      c.stroke();
      c.restore();
    }
  }
  c.shadowBlur = 0;
  c.strokeStyle = colors[2];
  c.globalAlpha = 0.55;
  c.lineWidth = r * 0.035;
  c.beginPath();
  for (let a = 0; a < TAU * 1.8; a += 0.15) {
    const rr = (r * 0.018 * a) / TAU;
    c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  c.stroke();
  c.restore();
}
export function leaf(c, x, y, size, angle = 0) {
  c.save();
  c.translate(x, y);
  c.rotate(angle);
  const g = c.createLinearGradient(-size, 0, size, 0);
  g.addColorStop(0, "#466852");
  g.addColorStop(0.5, "#91a590");
  g.addColorStop(1, "#587a5f");
  c.fillStyle = g;
  c.beginPath();
  c.moveTo(0, 0);
  c.bezierCurveTo(
    -size * 0.75,
    -size * 0.4,
    -size * 0.45,
    -size * 1.2,
    0,
    -size * 1.6,
  );
  c.bezierCurveTo(size * 0.55, -size * 0.9, size * 0.65, -size * 0.2, 0, 0);
  c.fill();
  c.lineWidth = size * 0.025;
  c.strokeStyle = "#e2e5c080";
  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(0, -size * 1.45);
  for (let i = 1; i <= 4; i++) {
    const y = -size * i * 0.23;
    c.moveTo(0, y);
    c.lineTo(size * 0.25, y - size * 0.2);
    c.moveTo(0, y);
    c.lineTo(-size * 0.23, y - size * 0.18);
  }
  c.stroke();
  c.restore();
}
export function sprig(c, x, y, length, angle = 0) {
  c.save();
  c.translate(x, y);
  c.rotate(angle);
  c.strokeStyle = "#859977";
  c.lineWidth = Math.max(0.002, length * 0.009);
  c.beginPath();
  c.moveTo(0, 0);
  c.quadraticCurveTo(length * 0.12, -length * 0.4, 0, -length);
  c.stroke();
  for (let i = 1; i <= 5; i++) {
    for (const side of [-1, 1])
      leaf(c, length * 0.035, (-length * i) / 6, length * 0.13, side * 0.75);
  }
  c.restore();
}
function pearl(c, x, y, r) {
  c.fillStyle = grad(c, x, y, r, ["#fff", "#fff5e4", "#b9b3a7"]);
  c.beginPath();
  c.arc(x, y, r, 0, TAU);
  c.fill();
}
export function floralCrown(c) {
  c.save();
  c.shadowBlur = 0;
  c.strokeStyle = "#7a956b";
  c.lineWidth = 0.014;
  c.beginPath();
  c.moveTo(-0.52, -0.32);
  c.quadraticCurveTo(0, -0.64, 0.52, -0.32);
  c.stroke();
  for (const side of [-1, 1]) {
    sprig(c, side * 0.32, -0.41, 0.26, side * 1.05);
    sprig(c, side * 0.46, -0.34, 0.18, side * 1.3);
  }
  for (let i = 0; i < 7; i++) {
    const x = (i - 3) * 0.125,
      y = -0.37 - Math.cos((i - 3) * 0.34) * 0.115;
    rose(
      c,
      x,
      y,
      i === 3 ? 0.115 : 0.075,
      i % 3 === 0 ? "blush" : "ivory",
      i * 0.9,
    );
    if (i % 2 === 0)
      for (let j = 0; j < 3; j++)
        pearl(c, x + 0.045 + j * 0.012, y - 0.075, 0.009);
  }
  c.restore();
}
export function jewelledTiara(c, kind, t = 0) {
  c.save();
  c.shadowBlur = 0;
  const gold = kind === "queen",
    starry = kind === "sparkle-crown";
  const metal = c.createLinearGradient(0, -0.8, 0, -0.25);
  metal.addColorStop(0, gold ? "#fff0ae" : "#ffffff");
  metal.addColorStop(0.45, gold ? "#b58d3d" : "#8ba7ba");
  metal.addColorStop(0.7, "#ffffff");
  metal.addColorStop(1, gold ? "#bb955b" : "#8296ab");
  c.strokeStyle = metal;
  c.lineWidth = 0.012;
  for (let i = -3; i <= 3; i++) {
    const x = i * 0.125,
      y = -0.38 - Math.cos(i * 0.4) * 0.18,
      hh = (gold ? 0.21 : 0.15) * (1 - Math.abs(i) * 0.14);
    c.beginPath();
    c.moveTo(x - 0.08, -0.33);
    c.bezierCurveTo(x - 0.12, y, x - 0.09, y - hh, x, y - hh);
    c.bezierCurveTo(x + 0.09, y - hh, x + 0.12, y, x + 0.08, -0.33);
    c.stroke();
    c.beginPath();
    c.ellipse(x, y - hh * 0.32, 0.035, 0.07, 0, 0, TAU);
    c.stroke();
    pearl(c, x, y - hh, 0.015);
    const r = gold ? 0.024 : 0.018;
    pearl(c, x, y - hh * 0.32, r);
    if (starry) {
      c.save();
      c.translate(x, y - hh - 0.035);
      c.rotate(Math.PI / 4);
      c.fillStyle = "#e3f6ff";
      c.fillRect(-0.015, -0.015, 0.03, 0.03);
      c.restore();
    }
  }
  for (const dy of [0, 0.025]) {
    c.beginPath();
    c.moveTo(-0.47, -0.33 + dy);
    c.quadraticCurveTo(0, -0.4 + dy, 0.47, -0.33 + dy);
    c.stroke();
  }
  for (let i = 0; i < 33; i++) {
    const x = (i - 16) * 0.027;
    pearl(c, x, -0.35 + x * x * 0.16, 0.009);
  }
  const sparkle = (x, y, r) => {
    c.strokeStyle = "#fff";
    c.lineWidth = 0.004;
    c.beginPath();
    c.moveTo(x - r, y);
    c.lineTo(x + r, y);
    c.moveTo(x, y - r * 1.6);
    c.lineTo(x, y + r * 1.6);
    c.stroke();
  };
  for (let i = 0; i < 4; i++) {
    const x = (i - 1.5) * 0.22;
    sparkle(
      x,
      -0.53 - Math.cos(i) * 0.06,
      0.01 + 0.008 * Math.sin(t * 1.5 + i),
    );
  }
  c.restore();
}
export function botanicalFrame(c, w, h, variant) {
  const unit = Math.min(w, h);
  c.save();
  if (variant === "rose-floral") {
    // Asymmetric garden arrangements leave the center and all faces clear.
    for (const [x, y, rotation, scale] of [
      [w * 0.06, h * 0.1, 0.3, 1],
      [w * 0.94, h * 0.9, Math.PI + 0.3, 0.85],
    ]) {
      c.save();
      c.translate(x, y);
      c.rotate(rotation);
      for (let i = 0; i < 5; i++)
        sprig(
          c,
          i * unit * 0.025,
          unit * 0.03,
          unit * (0.19 - i * 0.015),
          -0.8 + i * 0.4,
        );
      for (let i = 0; i < 6; i++) {
        const a = i * 2.4,
          rr = unit * 0.045 * Math.sqrt(i);
        rose(
          c,
          Math.cos(a) * rr,
          Math.sin(a) * rr,
          unit * (i === 0 ? 0.052 : 0.035) * scale,
          i % 3 ? "blush" : "ivory",
          a,
        );
      }
      c.restore();
    }
  } else {
    for (const [x, y, angle] of [
      [unit * 0.055, h - unit * 0.055, Math.PI / 4],
      [w - unit * 0.055, unit * 0.055, -Math.PI * 0.75],
    ]) {
      c.save();
      c.translate(x, y);
      c.rotate(angle);
      for (let i = 0; i < 5; i++)
        sprig(
          c,
          (i - 2) * unit * 0.035,
          -unit * 0.01,
          unit * (0.26 - Math.abs(i - 2) * 0.03),
          (i - 2) * 0.28,
        );
      for (let i = 0; i < 5; i++)
        rose(
          c,
          (i - 2) * unit * 0.045,
          -unit * (0.03 + Math.abs(i - 2) * 0.012),
          unit * (i === 2 ? 0.05 : 0.031),
          "ivory",
          i,
        );
      c.restore();
    }
  }
  c.restore();
}
