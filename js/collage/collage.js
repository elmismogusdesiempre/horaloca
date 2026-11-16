import { flower, star } from "../effects/art.js";
export function cover(ctx, image, x, y, w, h) {
  const scale = Math.max(w / image.width, h / image.height),
    sw = w / scale,
    sh = h / scale;
  ctx.drawImage(
    image,
    (image.width - sw) / 2,
    (image.height - sh) / 2,
    sw,
    sh,
    x,
    y,
    w,
    h,
  );
}
export async function makeCollage(photos, config) {
  if (photos.length !== 4) throw new Error("Se necesitan cuatro fotografías.");
  const strip = config.layout === "strip",
    c = document.createElement("canvas");
  c.width = strip ? 1200 : 2400;
  c.height = strip ? 3600 : 2200;
  const ctx = c.getContext("2d");
  ctx.fillStyle = config.theme === "cine" ? "#17171e" : "#f7f5ed";
  ctx.fillRect(0, 0, c.width, c.height);
  const pad = strip ? 65 : 90,
    gap = strip ? 30 : 40,
    header = strip ? 170 : 190,
    footer = strip ? 200 : 210,
    cols = strip ? 1 : 2,
    rows = strip ? 4 : 2,
    cw = (c.width - pad * 2 - gap * (cols - 1)) / cols,
    ch = (c.height - header - footer - gap * (rows - 1)) / rows;
  for (let i = 0; i < 4; i++)
    cover(
      ctx,
      photos[i],
      pad + (i % cols) * (cw + gap),
      header + Math.floor(i / cols) * (ch + gap),
      cw,
      ch,
    );
  ctx.textAlign = "center";
  ctx.fillStyle = config.theme === "cine" ? "#f7f5ed" : "#171724";
  ctx.font = `600 ${strip ? 46 : 66}px Arial`;
  ctx.fillText(config.name, c.width / 2, strip ? 105 : 120, c.width - pad * 2);
  ctx.fillStyle = "#696877";
  ctx.font = `${strip ? 25 : 32}px Arial`;
  ctx.fillText(
    config.text || "HORA LOCA",
    c.width / 2,
    c.height - footer * 0.55,
    c.width - pad * 2,
  );
  if (config.date) {
    ctx.font = `${strip ? 22 : 27}px Arial`;
    ctx.fillText(
      new Date().toLocaleDateString("es-CO"),
      c.width / 2,
      c.height - 35,
    );
  }
  ctx.fillStyle = config.color;
  ctx.fillRect(pad, header - 25, c.width - pad * 2, 5);
  if (config.theme === "boda") {
    flower(ctx, 35, 40, 27, "#fff5e3");
    flower(ctx, c.width - 35, c.height - 40, 27, "#efd1d4");
  }
  if (config.theme === "quince") {
    for (let i = 0; i < 7; i++)
      star(
        ctx,
        30 + i * 18,
        25 + (i % 2) * 20,
        5,
        config.secondary || "#b88ddc",
        4,
      );
  }
  if (config.theme === "cine") {
    for (let x = 20; x < c.width; x += 55) {
      ctx.fillStyle = "#e8e0c4";
      ctx.fillRect(x, 15, 28, 12);
      ctx.fillRect(x, c.height - 18, 28, 10);
    }
  }
  if (config.theme === "empresa") {
    ctx.fillStyle = config.color;
    ctx.fillRect(0, 0, 12, c.height);
    ctx.font = "18px Arial";
    ctx.textAlign = "left";
    ctx.fillText("HORA LOCA / EVENT EDITION", pad, c.height - 30);
  }
  const blob = await new Promise((resolve) =>
    c.toBlob(
      resolve,
      "image/jpeg",
      Math.max(0.5, Math.min(1, config.quality || 0.94)),
    ),
  );
  if (!blob) throw new Error("No se pudo exportar el collage.");
  return { blob, canvas: c };
}
