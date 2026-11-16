import { loadConfig, saveSession } from "../storage/local.js";
import { Camera } from "../camera/camera.js";
import { Tracker } from "../tracking/tracker.js";
import { EffectsEngine } from "../effects/engine.js";
import { compositions } from "../effects/selection.js";
import { makeCollage } from "../collage/collage.js";
import { Session } from "./session.js";
import { fitViewport, posePrompts } from "./viewport.js";
import { Screensaver } from "./screensaver.js";
import { startCamera } from "./startup.js";
import { GuestFlow } from "./guest-flow.js";
const $ = (s) => document.querySelector(s),
  canvas = $("#view"),
  ctx = canvas.getContext("2d"),
  camera = new Camera($("#video")),
  engine = new EffectsEngine();
let tracker = null,
  config,
  ids = [],
  previous = [],
  raf,
  returnTimer,
  objectURL,
  audio,
  busy = false,
  operation = 0;
const screensaver = new Screensaver((slide, index, total) => {
  $("#saver-title").textContent = slide.title;
  $("#saver-text").textContent = slide.text;
  $("#saver-step").textContent =
    `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  document
    .querySelectorAll(".saver-progress span")
    .forEach((el, i) => el.classList.toggle("current", i === index));
});
function announce(message) {
  $("#status").textContent = message;
  $("#camera-message").textContent = message;
}
function renderScreen(state) {
  screensaver.stop();
  document.body.classList.toggle("camera-on", state === "capturing");
  document.body.classList.toggle("session-active", state === "capturing");
  $("#welcome").hidden = state !== "idle";
  $("#processing").hidden = state !== "processing";
  if (state !== "capturing") {
    $("#pose-prompt").textContent = "";
    $("#countdown").textContent = "";
    $("#flash").classList.remove("active");
  }
  if (state === "idle" && !document.hidden) screensaver.start();
}
function releaseCamera() {
  cancelAnimationFrame(raf);
  raf = null;
  camera.stop();
  tracker?.close();
  tracker = null;
  engine.looks.close();
  ids = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
const flow = new GuestFlow({ release: releaseCamera, render: renderScreen });
function resizeCamera() {
  const rect = $(".camera-stage").getBoundingClientRect();
  fitViewport(canvas, rect.width, rect.height);
}
resizeCamera();
window.addEventListener("resize", resizeCamera);
window.visualViewport?.addEventListener("resize", resizeCamera);
function requestImmersion() {
  try {
    document.documentElement.requestFullscreen?.().catch(() => {});
  } catch {}
}
function render(now) {
  if (!camera.stream?.active) return;
  camera.draw(ctx, canvas.width, canvas.height);
  const faces =
    tracker?.update(camera.video, canvas.width, canvas.height, now) || [];
  engine.quality = (tracker?.cost || 0) > 65 ? 0.5 : 1;
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
const session = new Session({
  choose: () =>
    compositions(config.enabled, {
      tracking: tracker?.ready || false,
      previous,
    }),
  release: () => flow.captured(),
  onPhase: (p) => {
    if (p.phase === "effect") {
      ids = p.ids;
      $("#pose-prompt").textContent = posePrompts[p.index];
      $("#countdown").textContent = "";
    }
    if (p.phase === "prepare") {
      $("#pose-prompt").textContent = "¡Acérquense! Esto va a estar bueno.";
      $("#countdown").textContent = p.number;
    }
    if (p.phase === "countdown") $("#countdown").textContent = p.number;
    if (p.phase === "flash") {
      $("#countdown").textContent = "";
      if (p.index < 3) {
        $("#flash").classList.remove("active");
        void $("#flash").offsetWidth;
        $("#flash").classList.add("active");
      }
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
        "La cámara se interrumpió. Toca el botón para volver a intentarlo.",
      );
    const copy = document.createElement("canvas");
    copy.width = canvas.width;
    copy.height = canvas.height;
    copy.getContext("2d").drawImage(canvas, 0, 0);
    return copy;
  },
  finish: async (photos, choices) => {
    // Hardware is already released by Session immediately after shot 4.
    const { blob } = await makeCollage(photos, config);
    if (session.cancelled || document.hidden) return;
    previous = choices.map((c) => [...c].sort().join("|"));
    clearResult();
    objectURL = URL.createObjectURL(blob);
    const resultURL = objectURL;
    $("#collage-preview").src = objectURL;
    $("#download").href = objectURL;
    $("#download").download = `horaloca-${Date.now()}.jpg`;
    $("#result-status").textContent =
      "Tu cámara está apagada. Este recuerdo es tuyo.";
    flow.result();
    $("#result").showModal();
    // Deliver the result before local storage. Persistence must not hold up the
    // photo or, later, its download QR.
    void saveSession(blob, { event: config.name, compositions: choices }).catch(
      () => {
        if (objectURL === resultURL)
          $("#result-status").textContent =
            "Descarga tu recuerdo antes de continuar.";
      },
    );
    let remaining = Math.max(
      10,
      Math.min(300, Number(config.returnSeconds) || 45),
    );
    $("#return-message").textContent =
      `Volvemos al inicio en ${remaining} s · Cámara apagada`;
    returnTimer = setInterval(() => {
      $("#return-message").textContent =
        `Volvemos al inicio en ${--remaining} s · Cámara apagada`;
      if (remaining <= 0) reset();
    }, 1000);
  },
});
function clearResult() {
  clearInterval(returnTimer);
  if (objectURL) {
    URL.revokeObjectURL(objectURL);
    objectURL = null;
  }
  $("#collage-preview").removeAttribute("src");
  $("#download").removeAttribute("href");
}
function reset() {
  // Returning to the screensaver never calls getUserMedia.
  if ($("#result").open) $("#result").close();
  clearResult();
  flow.idle();
  $("#camera-start").disabled = busy || !config;
  announce("La cámara está apagada. Solo se activa cuando empiezas.");
}
$("#again").onclick = reset;
$("#result").addEventListener("cancel", (e) => {
  e.preventDefault();
  reset();
});
$("#camera-start").disabled = true;
screensaver.start();
try {
  config = await loadConfig();
  await engine.setLogo(config.logo).catch(() => {});
  document.documentElement.style.setProperty("--accent", config.color);
  $("#camera-start").disabled = false;
} catch {
  announce(
    "No se puede acceder al almacenamiento local. Habilítalo para continuar.",
  );
}
$("#camera-start").onclick = async () => {
  if (busy || !config || document.hidden) return;
  busy = true;
  const token = ++operation;
  $("#camera-start").disabled = true;
  screensaver.stop();
  let failure = null;
  const check = () => {
    if (token !== operation || document.hidden)
      throw new DOMException("Inicio cancelado.", "AbortError");
  };
  try {
    check();
    announce("Encendiendo la cámara… Si aparece un permiso, elige Permitir.");
    await startCamera(camera, () => {
      if (!config.sound) return;
      audio ??= new AudioContext();
      return audio.resume();
    });
    check();
    flow.start();
    resizeCamera();
    requestImmersion();
    $("#pose-prompt").textContent = "¡Busquen su mejor pose!";
    raf = requestAnimationFrame(render);
    const ownTracker = new Tracker();
    tracker = ownTracker;
    try {
      await ownTracker.init();
    } catch {
      /* Authorized scene effects remain available without tracking. */
    }
    if (token !== operation || document.hidden) {
      ownTracker.close();
      check();
    }
    await session.run();
  } catch (e) {
    if (e.name === "AbortError" && token === operation && !document.hidden)
      failure =
        "El navegador interrumpió el inicio. Toca de nuevo para activar la cámara.";
    else if (e.name !== "AbortError")
      failure =
        e.name === "NotAllowedError"
          ? "Permiso de cámara denegado. Habilítalo y vuelve a tocar el botón."
          : e.message;
  } finally {
    releaseCamera();
    // Success leaves the result on screen. Only errors/cancellation go idle.
    if (flow.state !== "result") flow.idle();
    if (failure) announce(failure);
    busy = false;
    $("#camera-start").disabled = !config;
  }
};
function suspend() {
  operation++;
  session.cancel();
  releaseCamera();
  // Switching apps to download must not dismiss an already delivered result.
  if (flow.state !== "result") {
    flow.idle();
    if ($("#result").open) $("#result").close();
    clearResult();
  }
  screensaver.stop();
  audio?.suspend().catch(() => {});
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) suspend();
  else if (flow.state === "idle") screensaver.start();
});
window.addEventListener("pagehide", suspend);
window.addEventListener("pageshow", () => {
  if (flow.state === "idle" && !document.hidden) screensaver.start();
});
