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

function reveal(el, delay = 0) {
  if (!el) return;
  el.classList.add("reveal");
  el.style.setProperty("--reveal-delay", `${delay}s`);
}

function revealStagger(root, selector, step = 0.08, start = 0) {
  if (!root) return;
  [...root.querySelectorAll(selector)].forEach((el, i) => {
    reveal(el, start + i * step);
  });
}

function initScrollReveal() {
  if (prefersReducedMotion()) return;

  document.body.classList.add("js-scroll");

  // Hero entrance (first viewport)
  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    revealStagger(heroContent, ":scope > *", 0.12, 0.05);
    requestAnimationFrame(() => {
      heroContent.querySelectorAll(".reveal").forEach((el) => {
        el.classList.add("is-visible");
      });
    });
  }

  revealStagger(document.querySelector(".about-grid"), ":scope > *", 0.12);
  reveal(document.querySelector(".supporter-panel"));
  revealStagger(document.querySelector(".section-charts .container"), ":scope > *", 0.1);
  revealStagger(document.querySelector(".charts-grid"), ".chart-card", 0.14, 0.05);
  reveal(document.querySelector(".section-animals .container"));
  reveal(document.querySelector(".marquee--animals"), 0.08);
  reveal(document.querySelector(".animals-cta"), 0.12);
  revealStagger(document.querySelector("#gastos"), ":scope > *", 0.1);
  revealStagger(document.querySelector(".footer-grid"), ":scope > *", 0.1);

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => {
    if (el.closest(".hero-content")) return;
    io.observe(el);
  });
}

function initExpenseBarReplay() {
  if (prefersReducedMotion()) return;
  const bars = document.getElementById("expensesBars");
  if (!bars) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        bars.classList.add("is-inview");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.25 }
  );
  io.observe(bars);
}

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
  initHeader();
  initPixButtons();
  initHeroVideo();
  initScrollReveal();
  initExpenseBarReplay();
});

window.EstimacaoMain = { copyPix, PIX_CODE, prefersReducedMotion };
