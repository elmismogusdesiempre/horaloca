import { path, ellipse, star, gradient, flower } from "./art.js";
const TAU = Math.PI * 2,
  hash = (n) => {
    const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return v - Math.floor(v);
  };
export function ambient(c, id, w, h, t, color, quality = 1) {
  const count = Math.round(55 * quality),
    pastel = id === "pastel-confetti";
  c.save();
  if (["disco-lights", "disco-ball", "celebration"].includes(id)) {
    if (id === "celebration") {
      c.strokeStyle = "#ffffff88";
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(0, h * 0.05);
      c.quadraticCurveTo(w * 0.5, h * 0.2, w, h * 0.05);
      c.stroke();
      for (let i = 0; i < 18; i++) {
        const x = (w * i) / 17,
          y = h * (0.05 + 0.3 * (i / 17) * (1 - i / 17));
        c.shadowBlur = 18;
        c.shadowColor = color;
        ellipse(c, x, y, 5, 8, i % 2 ? color : "#fff4ce");
      }
    } else {
      c.globalCompositeOperation = "screen";
      for (let i = 0; i < 5; i++) {
        c.save();
        c.translate(w * (i / 4), 0);
        c.rotate(Math.sin(t * 0.5 + i) * 0.6);
        const g = c.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, ["#ad5dfd55", "#3bf8ef44", "#ff58bc44"][i % 3]);
        g.addColorStop(1, "#ffffff00");
        path(
          c,
          [
            [-15, 0],
            [15, 0],
            [w * 0.25, h],
            [-w * 0.25, h],
          ],
          g,
        );
        c.restore();
      }
      if (id === "disco-ball") {
        const x = w * 0.5,
          y = h * 0.12,
          r = w * 0.075;
        ellipse(c, x, y, r, r, "#434c66");
        c.save();
        c.beginPath();
        c.arc(x, y, r, 0, TAU);
        c.clip();
        for (let a = -6; a <= 6; a++)
          for (let b = -6; b <= 6; b++) {
            c.fillStyle = gradient(c, x - r, y - r, x + r, y + r, [
              "#edf7ff",
              "#626a9c",
              "#fff",
            ]);
            c.globalAlpha = 0.25 + 0.65 * hash(a * 45 + b + Math.floor(t * 3));
            c.fillRect(x + (a * r) / 5, y + (b * r) / 5, r / 5 - 1, r / 5 - 1);
          }
        c.restore();
      }
    }
    c.restore();
    return;
  }
  for (let i = 0; i < count; i++) {
    const seed = hash(i),
      speed = hash(i + 80),
      x = (((seed * w + Math.sin(t * 0.4 + i) * w * 0.055) % w) + w) % w,
      y = ((hash(i + 20) * h + t * (12 + speed * 35)) % (h + 80)) - 40,
      r = 3 + speed * 8;
    const palette = pastel
      ? ["#ffe0f0", "#bce9e5", "#e6d5ff", "#fff4b2"]
      : ["#bdff41", "#ff77d4", "#bda2ff", "#ffcb61"];
    const fill = palette[i % 4];
    c.globalAlpha = 0.45 + speed * 0.5;
    c.save();
    c.translate(x, y);
    c.rotate(t * (speed - 0.5) + i);
    switch (id) {
      case "confetti":
        c.fillStyle = fill;
        c.scale(Math.cos(t + i) * 0.6 + 0.7, 1);
        c.fillRect(-r * 0.4, -r, r * 0.8, r * 2);
        break;
      case "pastel-confetti":
        c.fillStyle = fill;
        if (i % 3 === 0) ellipse(c, 0, 0, r, r, fill);
        else if (i % 3 === 1) star(c, 0, 0, r, fill);
        else
          path(
            c,
            [
              [-r, -r],
              [r, -r],
              [0, r],
            ],
            fill,
          );
        break;
      case "corporate-party":
        if (x > w * 0.2 && x < w * 0.8) {
          c.restore();
          continue;
        }
        c.strokeStyle = color;
        c.lineWidth = 4;
        c.beginPath();
        c.moveTo(-r * 2, -r * 3);
        c.bezierCurveTo(r * 3, -r * 2, -r * 3, r * 2, r * 2, r * 3);
        c.stroke();
        break;
      case "streamers":
        c.strokeStyle = fill;
        c.lineWidth = 3;
        c.beginPath();
        for (let j = 0; j < 35; j++) {
          const xx = Math.sin(j * 0.5 + t + i) * r,
            yy = j * 2;
          j ? c.lineTo(xx, yy) : c.moveTo(xx, yy);
        }
        c.stroke();
        break;
      case "petals":
        ellipse(
          c,
          0,
          0,
          r * 0.6,
          r * 1.3,
          gradient(c, 0, -r, 0, r, ["#fff8ee", "#e6aab9"]),
        );
        break;
      case "hearts":
      case "glitter-hearts":
        c.strokeStyle = id === "hearts" ? "#f2c9c3" : color;
        c.fillStyle = gradient(c, -r, -r, r, r, ["#fff8fb", color, "#b46da9"]);
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(0, r);
        c.bezierCurveTo(-r * 2, -r, -r, -r * 2, 0, -r);
        c.bezierCurveTo(r, -r * 2, r * 2, -r, 0, r);
        id === "hearts" ? c.stroke() : c.fill();
        break;
      case "bokeh": {
        const g = c.createRadialGradient(0, 0, 0, 0, 0, r * 4);
        g.addColorStop(0, "#fff0d533");
        g.addColorStop(0.7, "#edbdaf22");
        g.addColorStop(1, "#edbdaf00");
        ellipse(c, 0, 0, r * 4, r * 4, g);
        break;
      }
      case "bubbles":
        ellipse(c, 0, 0, r * 2, r * 2, "#ccedff08", "#ffffff77");
        ellipse(c, -r * 0.6, -r * 0.7, r * 0.45, r * 0.22, "#ffffffaa");
        break;
      case "butterflies":
        c.scale(1, Math.sin(t * 5 + i) * 0.35 + 0.65);
        ellipse(c, -r * 0.8, -r * 0.4, r, r * 0.7, fill);
        ellipse(c, r * 0.8, -r * 0.4, r, r * 0.7, fill);
        ellipse(c, -r * 0.6, r * 0.5, r * 0.6, r * 0.5, "#e3baffaa");
        ellipse(c, r * 0.6, r * 0.5, r * 0.6, r * 0.5, "#e3baffaa");
        c.fillStyle = "#fff";
        c.fillRect(-1, -r * 0.5, 2, r * 1.5);
        break;
      case "pink-sparks":
        c.strokeStyle = color;
        c.shadowColor = color;
        c.shadowBlur = 8;
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(0, r * 3);
        c.stroke();
        break;
      default:
        if (id === "subtle-sparks" && x > w * 0.15 && x < w * 0.85) {
          c.restore();
          continue;
        }
        c.globalAlpha *= 0.4 + 0.6 * Math.abs(Math.sin(t + i));
        star(
          c,
          0,
          0,
          id === "silver-stars" ? r : r * 0.6,
          id === "silver-stars"
            ? "#eef5ff"
            : id === "delicate"
              ? "#fff5d5"
              : color,
          4,
        );
    }
    c.restore();
  }
  c.restore();
}
function label(
  c,
  text,
  x,
  y,
  size,
  color = "#fff",
  align = "left",
  weight = 600,
) {
  c.fillStyle = color;
  c.font = `${weight} ${size}px Arial, sans-serif`;
  c.textAlign = align;
  c.fillText(text, x, y);
}
export function frame(c, id, w, h, t, config, logo) {
  const color = config.color || "#bdff41",
    name = config.name || "La noche es nuestra",
    s = w / 1000,
    p = 34 * s;
  c.save();
  c.lineWidth = 2 * s;
  const line = (x, y, x2, y2, col = color) => {
    c.strokeStyle = col;
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x2, y2);
    c.stroke();
  };
  const plate = (height = 100 * s) => {
    c.fillStyle = gradient(c, 0, h - height, 0, h, ["#10102100", "#101021ee"]);
    c.fillRect(0, h - height * 1.5, w, height * 1.5);
  };
  switch (id) {
    case "neon-frame":
      c.strokeStyle = color;
      c.shadowColor = color;
      c.shadowBlur = 20 * s;
      c.lineWidth = 4 * s;
      c.strokeRect(p, p, w - p * 2, h - p * 2);
      c.shadowBlur = 10 * s;
      c.strokeStyle = config.secondary;
      c.strokeRect(
        p + 10 * s,
        p + 10 * s,
        w - p * 2 - 20 * s,
        h - p * 2 - 20 * s,
      );
      break;
    case "rose-floral":
      for (let i = 0; i < 23; i++) {
        const a = Math.PI + (i * Math.PI) / 22,
          x = w / 2 + Math.cos(a) * w * 0.48,
          y = h * 0.28 + Math.sin(a) * h * 0.24;
        ellipse(c, x, y, 18 * s, 7 * s, "#728e75");
        if (i % 2 === 0) {
          flower(c, x, y, 22 * s, "#edb7c8");
          flower(c, x + 12 * s, y + 8 * s, 12 * s, "#fff0e1");
        }
      }
      break;
    case "white-floral":
      for (const [xx, yy, flip] of [
        [0, h, 1],
        [w, 0, -1],
      ]) {
        c.save();
        c.translate(xx, yy);
        c.scale(flip, -flip);
        for (let i = 0; i < 12; i++) {
          const x = i * 17 * s,
            y = 20 * s + Math.sin(i) * 14 * s;
          ellipse(c, x, y, 20 * s, 6 * s, "#809d7c");
          flower(
            c,
            x,
            y,
            16 * s,
            id === "white-floral" ? "#fffaf0" : "#f2c4d1",
          );
        }
        c.restore();
      }
      break;
    case "wedding-minimal":
    case "wedding-names":
      c.strokeStyle = "#eee0c0";
      c.strokeRect(p, p, w - p * 2, h - p * 2);
      plate(95 * s);
      label(
        c,
        id === "wedding-names" ? name : "THE WEDDING EDITION",
        w / 2,
        h - 49 * s,
        id === "wedding-names" ? 30 * s : 20 * s,
        "#fff5df",
        "center",
        400,
      );
      label(
        c,
        config.text || "Nuestra historia",
        w / 2,
        h - 24 * s,
        12 * s,
        "#f6e6d3",
        "center",
        400,
      );
      break;
    case "quince-frame":
    case "glam-name":
      plate(110 * s);
      for (let i = 0; i < 20; i++)
        star(
          c,
          p + hash(i) * (w - p * 2),
          p + hash(i + 40) * h * 0.18,
          4 * s,
          "#fff2db",
          4,
        );
      label(
        c,
        id === "quince-frame" ? "XV" : name,
        w / 2,
        h - 40 * s,
        id === "quince-frame" ? 64 * s : 34 * s,
        color,
        "center",
        400,
      );
      label(
        c,
        id === "quince-frame" ? name : "UNA NOCHE PARA BRILLAR",
        w / 2,
        h - 16 * s,
        13 * s,
        "#fff",
        "center",
      );
      break;
    case "business":
      plate(90 * s);
      c.fillStyle = color;
      c.fillRect(p, h - 72 * s, 5 * s, 46 * s);
      label(c, name, p + 22 * s, h - 44 * s, 25 * s);
      label(c, config.text, p + 22 * s, h - 23 * s, 12 * s, "#d6d7df");
      break;
    case "brand-logo":
      plate(100 * s);
      if (logo) {
        const scale = Math.min((130 * s) / logo.width, (60 * s) / logo.height);
        c.drawImage(
          logo,
          p,
          h - 80 * s,
          logo.width * scale,
          logo.height * scale,
        );
      } else label(c, "TU MARCA", p, h - 40 * s, 18 * s, color);
      label(c, name, w - p, h - 40 * s, 24 * s, "#fff", "right");
      break;
    case "tech":
      for (let j = 0; j < 2; j++) {
        c.save();
        c.translate(j ? w : 0, 0);
        c.scale(j ? -1 : 1, 1);
        for (let i = 0; i < 6; i++) {
          line(0, h * 0.2 + i * 30 * s, p + i * 8 * s, h * 0.2 + i * 30 * s);
          line(
            p + i * 8 * s,
            h * 0.2 + i * 30 * s,
            p + i * 8 * s,
            h * 0.3 + i * 30 * s,
          );
          ellipse(c, p + i * 8 * s, h * 0.3 + i * 30 * s, 3 * s, 3 * s, color);
        }
        c.restore();
      }
      plate(70 * s);
      label(c, name, p, h - 30 * s, 23 * s);
      break;
    case "future":
      for (const side of [0, 1]) {
        c.save();
        c.translate(side ? w : 0, 0);
        c.scale(side ? -1 : 1, 1);
        path(
          c,
          [
            [0, 0],
            [w * 0.25, 0],
            [w * 0.2, 28 * s],
            [40 * s, 28 * s],
            [40 * s, h * 0.3],
            [0, h * 0.4],
          ],
          "#11192caa",
          color,
        );
        c.restore();
      }
      plate(70 * s);
      label(c, name, w / 2, h - 24 * s, 23 * s, color, "center");
      break;
    case "launch":
      plate(135 * s);
      label(c, "NUEVO / NEXT", p, h - 90 * s, 14 * s, color);
      label(c, name, p, h - 48 * s, 38 * s);
      line(p, h - 30 * s, w - p, h - 30 * s);
      break;
    case "conference":
      plate(125 * s);
      c.fillStyle = color;
      c.fillRect(p, h - 105 * s, 70 * s, 70 * s);
      label(c, "HOLA", p + 35 * s, h - 62 * s, 16 * s, "#111", "center");
      label(c, name, p + 95 * s, h - 63 * s, 29 * s);
      label(c, config.text, p + 95 * s, h - 37 * s, 13 * s);
      break;
    case "awards":
      plate(110 * s);
      for (let side of [-1, 1])
        for (let i = 0; i < 10; i++) {
          c.save();
          c.translate(
            w * 0.5 + side * (100 * s + i * 6 * s),
            h - 55 * s - i * 6 * s,
          );
          c.rotate(side * (-0.4 - i * 0.07));
          ellipse(c, 0, 0, 5 * s, 13 * s, "#d8b76b");
          c.restore();
        }
      label(c, name, w / 2, h - 40 * s, 24 * s, "#ffe5a0", "center");
      break;
    case "anniversary":
      plate(120 * s);
      ellipse(
        c,
        w - 90 * s,
        h - 75 * s,
        49 * s,
        49 * s,
        "#17232bee",
        "#ddbf79",
      );
      label(
        c,
        "CELEBRAMOS",
        w - 90 * s,
        h - 70 * s,
        10 * s,
        "#e8ca85",
        "center",
      );
      label(c, "JUNTOS", w - 90 * s, h - 51 * s, 13 * s, "#fff", "center");
      label(c, name, p, h - 48 * s, 30 * s);
      break;
    default:
      cinema(c, id, w, h, t, config, s, label, line, plate);
  }
  c.restore();
}
function cinema(c, id, w, h, t, config, s, label, line, plate) {
  const p = 30 * s,
    color = config.color,
    name = config.name;
  switch (id) {
    case "breaking":
    case "presenter":
      plate(130 * s);
      c.fillStyle = id === "breaking" ? "#d72e45" : "#1232a2";
      c.fillRect(p, h - 115 * s, 220 * s, 30 * s);
      label(
        c,
        id === "breaking" ? "ÚLTIMA HORA" : "EN EL ESTUDIO",
        p + 12 * s,
        h - 94 * s,
        16 * s,
      );
      c.fillStyle = "#f4f4ef";
      c.fillRect(p, h - 85 * s, w - p * 2, 48 * s);
      label(
        c,
        id === "breaking" ? "LA FIESTA ROMPE TODOS LOS RÉCORDS" : name,
        p + 12 * s,
        h - 52 * s,
        24 * s,
        "#172036",
      );
      label(
        c,
        "HORA LOCA  /  EDICIÓN CELEBRACIÓN · SEÑAL FICTICIA",
        p,
        h - 16 * s,
        12 * s,
      );
      break;
    case "security":
      c.fillStyle = "#0f30251a";
      c.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y += 5 * s) {
        c.fillStyle = "#00000016";
        c.fillRect(0, y, w, s);
      }
      label(c, "CAM 04  •  SIMULACIÓN CCTV", p, p + 20 * s, 17 * s, "#d7ffe5");
      label(c, new Date().toLocaleString("es-CO"), p, h - p, 17 * s, "#d7ffe5");
      c.strokeStyle = "#d7ffe577";
      c.strokeRect(p, h * 0.2, w - p * 2, h * 0.6);
      break;
    case "live":
      c.fillStyle = "#f13462";
      c.fillRect(p, p, 100 * s, 30 * s);
      label(c, "● EN VIVO", p + 10 * s, p + 21 * s, 14 * s);
      label(
        c,
        "TRANSMISIÓN FICTICIA",
        w - p,
        p + 21 * s,
        12 * s,
        "#fff",
        "right",
      );
      plate(80 * s);
      label(c, "@horaloca  /  " + name, p, h - 35 * s, 21 * s);
      for (let i = 0; i < 4; i++)
        label(
          c,
          ["♡", "✦", "♡", "✧"][i],
          w - p - i * 18 * s,
          h - 35 * s - i * 22 * s,
          25 * s,
          color,
        );
      break;
    case "magazine":
      label(c, "NOCHE", w / 2, h * 0.17, 110 * s, "#fff", "center", 900);
      label(
        c,
        "THE CELEBRATION ISSUE",
        w / 2,
        h * 0.21,
        12 * s,
        "#fff",
        "center",
      );
      plate(150 * s);
      label(c, "PERSONAS", p, h - 100 * s, 40 * s);
      label(c, "QUE HACEN HISTORIA", p, h - 67 * s, 25 * s);
      label(c, name, p, h - 30 * s, 18 * s, color);
      for (let i = 0; i < 22; i++) {
        c.fillStyle = "#fff";
        c.fillRect(
          w - p - 90 * s + i * 4 * s,
          h - 60 * s,
          ((i % 3) + 1) * s,
          35 * s,
        );
      }
      break;
    case "red-carpet":
      plate(120 * s);
      path(
        c,
        [
          [w * 0.3, h],
          [w * 0.43, h * 0.7],
          [w * 0.57, h * 0.7],
          [w * 0.7, h],
        ],
        "#8d1d39aa",
      );
      for (let i = 0; i < 8; i++)
        star(c, hash(i) * w, hash(i + 20) * h, 5 * s, "#fff6cd", 4);
      label(
        c,
        "WORLD PREMIERE",
        w / 2,
        h - 65 * s,
        16 * s,
        "#e9cc8c",
        "center",
      );
      label(c, name, w / 2, h - 27 * s, 32 * s, "#fff", "center");
      break;
    case "suspect":
      c.strokeStyle = "#ffffff55";
      for (let i = 1; i < 7; i++) {
        const y = (h * i) / 7;
        line(0, y, w, y, "#ffffff44");
        label(c, `${190 - i * 10} cm`, p, y - 5 * s, 12 * s);
      }
      c.fillStyle = "#16161fe8";
      c.fillRect(w * 0.2, h * 0.76, w * 0.6, h * 0.19);
      label(
        c,
        "SOSPECHOSO DE BAILAR",
        w / 2,
        h * 0.83,
        22 * s,
        "#fff",
        "center",
      );
      label(
        c,
        "EXP. 004 · COMEDIA / " + name,
        w / 2,
        h * 0.9,
        13 * s,
        "#ddd",
        "center",
      );
      break;
    case "spy":
      for (let i = 0; i < 4; i++) {
        const x = i % 2 ? w - p : p,
          y = i < 2 ? p : h - p;
        line(x, y, x + (i % 2 ? -1 : 1) * 60 * s, y, "#e8e4c5");
        line(x, y, x, y + (i < 2 ? 1 : -1) * 60 * s, "#e8e4c5");
      }
      label(
        c,
        "CLASIFICADO / MISIÓN: CELEBRAR",
        p + 15 * s,
        p + 30 * s,
        15 * s,
        "#eee5ba",
      );
      plate(75 * s);
      label(c, name, w / 2, h - 30 * s, 25 * s, "#fff", "center");
      break;
    case "scifi":
      c.strokeStyle = "#83f6edaa";
      c.beginPath();
      c.arc(w / 2, h / 2, Math.min(w, h) * 0.38, -0.4, 1.9);
      c.stroke();
      for (let i = 0; i < 14; i++) {
        line(
          p,
          h * 0.25 + i * 14 * s,
          p + hash(i) * 70 * s,
          h * 0.25 + i * 14 * s,
          "#83f6ed",
        );
      }
      label(c, "ORBITAL / SECTOR 07", p, p + 15 * s, 15 * s, "#83f6ed");
      label(c, "O₂ 98%  ·  " + name, p, h - p, 18 * s, "#83f6ed");
      break;
    case "retro":
      c.fillStyle = "#18171d";
      c.fillRect(0, 0, w, 45 * s);
      c.fillRect(0, h - 65 * s, w, 65 * s);
      for (let i = 0; i < 24; i++) {
        c.fillStyle = "#eee9d7";
        c.fillRect(i * 45 * s + 8 * s, 10 * s, 20 * s, 20 * s);
        c.fillRect(i * 45 * s + 8 * s, h - 25 * s, 20 * s, 15 * s);
      }
      label(
        c,
        "35 MM  ·  " + name,
        w / 2,
        h - 40 * s,
        14 * s,
        "#efe1c4",
        "center",
      );
      break;
  }
}
