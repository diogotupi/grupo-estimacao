const PIX_CODE = "08996430000117";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function showToast(message) {
  const toast = document.getElementById("pixToast");
  if (!toast) return;
  toast.hidden = false;
  toast.textContent = message;
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.hidden = true;
  }, 5200);
}

async function copyPix() {
  const message = window.EstimacaoI18n?.t("pix.toast") ||
    "Prontinho! É só abrir o aplicativo do seu banco e colar o pix com o valor que desejar.";

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(PIX_CODE);
    } else {
      const input = document.createElement("textarea");
      input.value = PIX_CODE;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.left = "-9999px";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    showToast(message);
  } catch {
    showToast(PIX_CODE);
  }
}

function initHeader() {
  const header = document.getElementById("header");
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("navMenu");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }
}

function initPixButtons() {
  document.querySelectorAll("[data-copy-pix]").forEach((btn) => {
    btn.addEventListener("click", () => {
      void copyPix();
    });
  });
}

function initHeroVideo() {
  const video = document.querySelector(".hero-video");
  if (!video) return;

  const source = video.querySelector("source");
  const src = source?.getAttribute("src") || video.getAttribute("src");
  if (!src) {
    video.removeAttribute("autoplay");
    video.style.display = "none";
    return;
  }

  // Ensure src is on the video element for more reliable playback
  if (!video.getAttribute("src")) {
    video.src = src;
  }

  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute("muted", "");
  video.playsInline = true;

  if (prefersReducedMotion()) {
    video.removeAttribute("autoplay");
    video.pause();
    return;
  }

  const tryPlay = () => {
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Autoplay blocked: keep poster/fallback visible
      });
    }
  };

  if (video.readyState >= 2) tryPlay();
  else video.addEventListener("loadeddata", tryPlay, { once: true });
  video.addEventListener("canplay", tryPlay, { once: true });
}

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
  initHeader();
  initPixButtons();
  initHeroVideo();
});

window.EstimacaoMain = { copyPix, PIX_CODE, prefersReducedMotion };
