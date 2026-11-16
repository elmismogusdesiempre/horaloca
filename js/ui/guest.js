import { loadConfig, saveSession } from "../storage/local.js";
import { Camera } from "../camera/camera.js";
import { Tracker } from "../tracking/tracker.js";
import { EffectsEngine } from "../effects/engine.js";
import { compositions } from "../effects/selection.js";
import { makeCollage } from "../collage/collage.js";
import { Session } from "./session.js";
const $ = (s) => document.querySelector(s),
  canvas = $("#view"),
  ctx = canvas.getContext("2d"),
  camera = new Camera($("#video")),
  engine = new EffectsEngine(),
  tracker = new Tracker();
let config,
  ids = [],
  previous = [],
  raf,
  returnTimer,
  objectURL,
  audio,
  ready = false;
try {
  config = await loadConfig();
} catch {
  $("#status").textContent =
    "No se puede acceder al almacenamiento local. Habilítalo para continuar.";
  throw new Error("IndexedDB unavailable");
}
$("#event-name").textContent = config.name;
document.documentElement.style.setProperty("--accent", config.color);
await engine.setLogo(config.logo).catch(() => {});
function render(now) {
  camera.draw(ctx, canvas.width, canvas.height);
  const faces = tracker.update(camera.video, canvas.width, canvas.height, now);
  engine.quality = tracker.cost > 65 ? 0.5 : 1;
  engine.render(
    ctx,
    canvas.width,
    canvas.height,
    ids,
    faces,
    now / 1000,
    config,
  );
  raf = requestAnimationFrame(render);
}
function tone() {
  if (!config.sound || !audio) return;
  try {
    const o = audio.createOscillator(),
      g = audio.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(880, audio.currentTime);
    o.frequency.exponentialRampToValueAtTime(240, audio.currentTime + 0.09);
    g.gain.setValueAtTime(0.12, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.12);
    o.connect(g).connect(audio.destination);
    o.start();
    o.stop(audio.currentTime + 0.13);
  } catch {}
}
$("#camera-start").onclick = async () => {
  const b = $("#camera-start");
  b.disabled = true;
  try {
    await camera.start();
    $("#welcome").hidden = true;
    $("#welcome").style.display = "none";
    raf = requestAnimationFrame(render);
    $("#status").textContent =
      "Cargando seguimiento facial. La primera carga necesita conexión…";
    try {
      await tracker.init();
      $("#status").textContent =
        "Cámara lista · seguimiento de hasta 3 rostros · fotos locales.";
    } catch {
      $("#status").textContent =
        "Seguimiento no disponible: solo se usarán ambientes y marcos autorizados.";
    }
    ids = compositions(config.enabled, { tracking: tracker.ready })[0];
    ready = true;
    $("#start").disabled = false;
  } catch (e) {
    $("#status").textContent =
      e.name === "NotAllowedError"
        ? "Permiso de cámara denegado. Habilítalo en el navegador y vuelve a intentarlo."
        : e.message;
    cancelAnimationFrame(raf);
    camera.stop();
    tracker.close();
    $("#welcome").hidden = false;
    $("#welcome").style.display = "flex";
    b.disabled = false;
  }
};
const session = new Session({
  choose: () =>
    compositions(config.enabled, { tracking: tracker.ready, previous }),
  onPhase: (p) => {
    if (p.phase === "effect") ids = p.ids;
    if (p.phase === "prepare") {
      $("#countdown").className = "countdown prepare";
      $("#countdown").textContent = `Prepárate… ${p.number}`;
    }
    if (p.phase === "countdown") {
      $("#countdown").className = "countdown";
      $("#countdown").textContent = p.number;
      $("#photo-step").hidden = false;
      $("#photo-step").textContent = `FOTO ${p.index + 1} / 4`;
    }
    if (p.phase === "flash") {
      $("#countdown").textContent = "";
      $("#flash").classList.remove("active");
      void $("#flash").offsetWidth;
      $("#flash").classList.add("active");
      tone();
    }
  },
  capture: async () => {
    if (
      !camera.stream?.active ||
      camera.video.readyState < 2 ||
      camera.video.paused
    )
      throw new Error(
        "La cámara se interrumpió. Vuelve a activar la cámara antes de otra sesión.",
      );
    const copy = document.createElement("canvas");
    copy.width = canvas.width;
    copy.height = canvas.height;
    copy.getContext("2d").drawImage(canvas, 0, 0);
    return copy;
  },
  finish: async (photos, choices) => {
    $("#status").textContent = "Preparando tu recuerdo…";
    const { blob } = await makeCollage(photos, config);
    previous = choices.map((c) => [...c].sort().join("|"));
    try {
      await saveSession(blob, { event: config.name, compositions: choices });
      $("#status").textContent =
        "Recuerdo guardado localmente. Descárgalo para conservarlo.";
    } catch {
      $("#status").textContent =
        "No se pudo guardar localmente. Descarga el recuerdo antes de continuar.";
    }
    if (objectURL) URL.revokeObjectURL(objectURL);
    objectURL = URL.createObjectURL(blob);
    $("#collage-preview").src = objectURL;
    $("#download").href = objectURL;
    $("#download").download = `horaloca-${Date.now()}.jpg`;
    $("#photo-step").hidden = true;
    $("#result").showModal();
    let remaining = Math.max(
      10,
      Math.min(300, Number(config.returnSeconds) || 45),
    );
    $("#return-message").textContent = `Volvemos a empezar en ${remaining} s`;
    returnTimer = setInterval(() => {
      $("#return-message").textContent =
        `Volvemos a empezar en ${--remaining} s`;
      if (remaining <= 0) reset();
    }, 1000);
  },
});
$("#start").onclick = async () => {
  if (!ready || session.running) return;
  $("#start").disabled = true;
  try {
    if (config.sound) {
      audio ??= new AudioContext();
      await audio.resume();
    }
    document.documentElement.requestFullscreen?.().catch(() => {});
    await session.run();
  } catch (e) {
    $("#countdown").textContent = "";
    $("#status").textContent = e.message;
    if (!camera.stream?.active || camera.video.paused) {
      ready = false;
      cancelAnimationFrame(raf);
      camera.stop();
      tracker.close();
      $("#welcome").hidden = false;
      $("#welcome").style.display = "flex";
      $("#camera-start").disabled = false;
    }
  } finally {
    if (!$("#result").open) $("#start").disabled = !ready;
  }
};
function reset() {
  clearInterval(returnTimer);
  if ($("#result").open) $("#result").close();
  $("#start").disabled = !ready;
  $("#countdown").textContent = "";
  $("#photo-step").hidden = true;
  ids = [];
  if (objectURL) {
    URL.revokeObjectURL(objectURL);
    objectURL = null;
    $("#collage-preview").removeAttribute("src");
    $("#download").removeAttribute("href");
  }
}
$("#again").onclick = reset;
$("#result").addEventListener("cancel", (e) => {
  e.preventDefault();
  reset();
});
window.addEventListener("pagehide", () => {
  session.cancel();
  clearInterval(returnTimer);
  cancelAnimationFrame(raf);
  camera.stop();
  tracker.close();
  audio?.close();
  if (objectURL) URL.revokeObjectURL(objectURL);
});
