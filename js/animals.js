function cloudinaryVideoThumb(mp4Url) {
  return mp4Url
    .replace("/video/upload/", "/video/upload/so_0,w_800,h_900,c_fill,q_auto,f_jpg/")
    .replace(/\.mp4$/i, ".jpg");
}

function cloudinaryImageThumb(jpgUrl) {
  return jpgUrl.replace("/image/upload/", "/image/upload/w_800,h_900,c_fill,q_auto,f_auto/");
}

const ANIMALS = [
  {
    id: "eros",
    name: { pt: "Eros", en: "Eros" },
    type: "video",
    src: "https://res.cloudinary.com/dc48hzb6b/video/upload/v1786389191/Eros_rdiwzj.mp4",
    thumb: cloudinaryVideoThumb(
      "https://res.cloudinary.com/dc48hzb6b/video/upload/v1786389191/Eros_rdiwzj.mp4"
    ),
    story: {
      pt: "Eros foi resgatado após maus tratos. Nós demos a ele uma segunda chance, para que ele tivesse uma vida digna junto com seus novos amiguinhos.",
      en: "Eros was rescued after abuse. We gave him a second chance so he could live with dignity alongside his new friends.",
    },
  },
  {
    id: "fisher",
    name: { pt: "Fisher", en: "Fisher" },
    type: "video",
    src: "https://res.cloudinary.com/dc48hzb6b/video/upload/v1786389088/Fisher_jy8pxc.mp4",
    thumb: cloudinaryVideoThumb(
      "https://res.cloudinary.com/dc48hzb6b/video/upload/v1786389088/Fisher_jy8pxc.mp4"
    ),
    story: {
      pt: "Abandonado no lixão do município, Fisher foi resgatado por nós à beira da morte. Extremamente magro, conosco ele teve a chance de viver uma vida digna com seus novos amigos.",
      en: "Abandoned at the city dump, Fisher was rescued by us near death. Extremely thin, with us he got the chance to live with dignity among his new friends.",
    },
  },
  {
    id: "claudio",
    name: { pt: "Claudio", en: "Claudio" },
    type: "video",
    src: "https://res.cloudinary.com/dc48hzb6b/video/upload/v1786389083/Claudio_ulwghm.mp4",
    thumb: cloudinaryVideoThumb(
      "https://res.cloudinary.com/dc48hzb6b/video/upload/v1786389083/Claudio_ulwghm.mp4"
    ),
    story: {
      pt: "Claudio foi resgatado após um atropelamento na Rio-Bahia. Vários ossos quebrados, e foi largado para morrer. Esse antes e depois é incrível! Claudio teve sua segunda chance conosco para viver ao lado de seus novos coleguinhas aqui no nosso abrigo.",
      en: "Claudio was rescued after being hit on the Rio-Bahia highway. Several broken bones, and he was left to die. This before and after is incredible! With us he got a second chance to live with his new friends at our shelter.",
    },
  },
  {
    id: "rafa",
    name: { pt: "Rafa", en: "Rafa" },
    type: "image",
    src: "https://res.cloudinary.com/dc48hzb6b/image/upload/v1786389066/Rafa_pvkdky.jpg",
    thumb: cloudinaryImageThumb(
      "https://res.cloudinary.com/dc48hzb6b/image/upload/v1786389066/Rafa_pvkdky.jpg"
    ),
    story: {
      pt: "O Rafa foi um caso extremo! Dá uma olhada nesse antes e depois!",
      en: "Rafa was an extreme case! Take a look at this before and after!",
    },
  },
  {
    id: "oreo",
    name: { pt: "Oreo", en: "Oreo" },
    type: "video",
    src: "https://res.cloudinary.com/dc48hzb6b/video/upload/v1786389068/Oreo_b6zal0.mp4",
    thumb: cloudinaryVideoThumb(
      "https://res.cloudinary.com/dc48hzb6b/video/upload/v1786389068/Oreo_b6zal0.mp4"
    ),
    story: {
      pt: "Esse é o gatinho Oreo! Foi abandonado e resgatado com muitas feridas! Oreo pode ter uma segunda chance ao lado de seus amigos!",
      en: "This is Oreo the kitten! He was abandoned and rescued with many wounds. Oreo got a second chance alongside his friends!",
    },
  },
  {
    id: "maus-tratos",
    name: { pt: "Maus tratos", en: "Abuse case" },
    type: "video",
    src: "https://res.cloudinary.com/dc48hzb6b/video/upload/v1786389071/Maus_Tratos_aualud.mp4",
    thumb: cloudinaryVideoThumb(
      "https://res.cloudinary.com/dc48hzb6b/video/upload/v1786389071/Maus_Tratos_aualud.mp4"
    ),
    story: {
      pt: "Esses dois cachorrinhos estavam sendo maltratados por sua dona. Nós os resgatamos para que pudessem ter uma vida digna.",
      en: "These two puppies were being mistreated by their owner. We rescued them so they could live with dignity.",
    },
  },
  {
    id: "abandono",
    name: { pt: "Abandono", en: "Abandonment" },
    type: "video",
    src: "https://res.cloudinary.com/dc48hzb6b/video/upload/v1786389071/Abandono_fvjeot.mp4",
    thumb: cloudinaryVideoThumb(
      "https://res.cloudinary.com/dc48hzb6b/video/upload/v1786389071/Abandono_fvjeot.mp4"
    ),
    story: {
      pt: "Abandonado para morrer, veja como ele ficou magrinho. Felizmente pudemos dar a ele uma vida digna no abrigo.",
      en: "Left to die, see how thin he was. Thankfully we could give him a dignified life at the shelter.",
    },
  },
];

let marqueeSuppressClick = false;

function prefersReducedMotionAnimals() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const desktopMarqueeMq = () =>
  window.matchMedia("(min-width: 901px) and (hover: hover)");

function currentLang() {
  return window.EstimacaoI18n?.getStoredLang?.() || "pt";
}

function buildMarqueeItems(group) {
  group.innerHTML = "";
  ANIMALS.forEach((animal, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "marquee-item";
    btn.dataset.index = String(index);
    const lang = currentLang();
    const isVideo = animal.type === "video";
    btn.innerHTML = `
      <span class="marquee-thumb">
        <img src="${animal.thumb}" alt="${animal.name[lang]}" loading="lazy" width="280" height="320">
        ${isVideo ? '<span class="marquee-play" aria-hidden="true"></span>' : ""}
      </span>
      <p class="marquee-item-name">${animal.name[lang]}</p>
    `;
    group.appendChild(btn);
  });
}

function syncMarqueeLabels() {
  const lang = currentLang();
  document.querySelectorAll(".marquee-item").forEach((item) => {
    const i = Number(item.dataset.index);
    const animal = ANIMALS[i];
    if (!animal) return;
    const img = item.querySelector("img");
    const name = item.querySelector(".marquee-item-name");
    if (img) img.alt = animal.name[lang];
    if (name) name.textContent = animal.name[lang];
  });
}

function waitMarqueeImages(track) {
  const imgs = track.querySelectorAll("img");
  return Promise.all(
    [...imgs].map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) resolve();
          else {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
          }
        })
    )
  );
}

function initAnimalsMarquee() {
  const marquee = document.querySelector(".marquee--animals");
  const track = marquee?.querySelector(".marquee-track");
  const group = document.getElementById("animalsMarqueeGroup");
  const clone = document.getElementById("animalsMarqueeClone");
  const prevBtn = marquee?.querySelector("[data-marquee-prev]");
  const nextBtn = marquee?.querySelector("[data-marquee-next]");
  if (!marquee || !track || !group || !clone) return;

  buildMarqueeItems(group);
  buildMarqueeItems(clone);
  clone.setAttribute("aria-hidden", "true");

  if (prefersReducedMotionAnimals()) return;

  let loopLen = 0;
  let offset = 0;
  let velocity = 0;
  let autoSpeed = 0.5;
  let rafId = null;
  let isDragging = false;
  let pointerId = null;
  let lastX = 0;
  let lastTime = 0;
  let dragTotal = 0;
  let hoverPaused = false;
  let running = false;
  const desktopMq = desktopMarqueeMq();

  const normalize = () => {
    if (loopLen <= 0) return;
    while (offset <= -loopLen) offset += loopLen;
    while (offset > 0) offset -= loopLen;
  };

  const apply = () => {
    track.style.transform = `translate3d(${offset}px, 0, 0)`;
  };

  const measure = () => {
    let w = group.scrollWidth || group.getBoundingClientRect().width;
    if (w < 40) {
      w = [...group.querySelectorAll(".marquee-item")].reduce(
        (sum, el) =>
          sum + Math.max(el.getBoundingClientRect().width, el.offsetWidth, 0),
        0
      );
    }
    if (w < 40) {
      // Fallback: don't block autoplay waiting on late layout/images
      w = ANIMALS.length * 294;
    }
    loopLen = w;
    normalize();
    apply();
    return true;
  };

  const tick = () => {
    const allowAuto =
      !isDragging && loopLen > 0 && !(hoverPaused && desktopMq.matches);
    if (allowAuto) {
      if (Math.abs(velocity) > 0.08) {
        offset += velocity;
        velocity *= 0.94;
        normalize();
        apply();
      } else {
        velocity = 0;
        offset -= autoSpeed;
        normalize();
        apply();
      }
    }
    rafId = requestAnimationFrame(tick);
  };

  const boot = () => {
    measure();
    marquee.classList.add("is-js-marquee");
    if (!running) {
      running = true;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
    }
    return true;
  };

  const nudge = (dir) => {
    measure();
    const step = Math.min(loopLen * 0.28, 380);
    offset += dir * step;
    velocity = 0;
    normalize();
    apply();
  };

  let pointerActive = false;
  let startPointerX = 0;

  track.addEventListener(
    "pointerdown",
    (e) => {
      if (e.button !== 0 || e.target.closest(".marquee-control")) return;
      if (!running) boot();
      if (loopLen <= 0) return;
      pointerActive = true;
      pointerId = e.pointerId;
      startPointerX = e.clientX;
      lastX = e.clientX;
      lastTime = performance.now();
      dragTotal = 0;
      isDragging = false;
      velocity = 0;
    },
    { passive: true }
  );

  track.addEventListener(
    "pointermove",
    (e) => {
      if (!pointerActive || e.pointerId !== pointerId) return;
      const totalDx = e.clientX - startPointerX;
      if (!isDragging && Math.abs(totalDx) > 8) {
        isDragging = true;
        try {
          track.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }
      if (!isDragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dt = Math.max(now - lastTime, 1);
      dragTotal += Math.abs(dx);
      offset += dx;
      velocity = (dx / dt) * (1000 / 60);
      lastX = e.clientX;
      lastTime = now;
      normalize();
      apply();
    },
    { passive: true }
  );

  const endPointer = (e) => {
    if (!pointerActive || e.pointerId !== pointerId) return;
    const pid = pointerId;
    pointerActive = false;
    pointerId = null;
    if (isDragging) {
      try {
        track.releasePointerCapture(pid);
      } catch {
        /* ignore */
      }
      if (dragTotal > 12 && e.pointerType === "touch") marqueeSuppressClick = true;
      velocity *= 0.85;
    }
    isDragging = false;
  };

  track.addEventListener("pointerup", endPointer, { passive: true });
  track.addEventListener("pointercancel", endPointer, { passive: true });

  marquee.addEventListener("mouseenter", () => {
    if (desktopMq.matches) hoverPaused = true;
  });
  marquee.addEventListener("mouseleave", () => {
    hoverPaused = false;
  });

  prevBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    if (!running) boot();
    nudge(1);
  });
  nextBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    if (!running) boot();
    nudge(-1);
  });

  window.addEventListener("resize", () => {
    if (running) measure();
    else boot();
  });

  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(() => {
      if (running) measure();
      else boot();
    });
    ro.observe(track);
    ro.observe(group);
  }

  // Start immediately — don't wait for Cloudinary thumbs
  boot();

  void (async () => {
    await waitMarqueeImages(track);
    measure();
    if (!running) boot();
  })();

  window.addEventListener(
    "load",
    () => {
      measure();
      if (!running) boot();
    },
    { once: true }
  );

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        measure();
        if (!running) boot();
      },
      { threshold: 0.05, rootMargin: "120px 0px" }
    );
    io.observe(marquee);
  }
}

function initAnimalsLightbox() {
  const lightbox = document.getElementById("animalLightbox");
  const group = document.getElementById("animalsMarqueeGroup");
  if (!lightbox || !group) return;

  const mediaWrap = document.getElementById("lightboxMedia");
  const img = document.getElementById("lightboxImg");
  const video = document.getElementById("lightboxVideo");
  const nameEl = document.getElementById("lightboxName");
  const storyEl = document.getElementById("lightboxStory");
  const counter = document.getElementById("lightboxCounter");
  const closeEls = lightbox.querySelectorAll("[data-lightbox-close]");
  const prevBtn = lightbox.querySelector("[data-lightbox-prev]");
  const nextBtn = lightbox.querySelector("[data-lightbox-next]");

  let index = 0;
  let isOpen = false;
  let lastFocus = null;

  const stopVideo = () => {
    if (!video) return;
    video.pause();
    video.removeAttribute("src");
    video.load();
  };

  const paint = () => {
    const animal = ANIMALS[index];
    const lang = currentLang();
    if (!animal) return;

    nameEl.textContent = animal.name[lang];
    storyEl.textContent = animal.story[lang];
    if (counter) counter.textContent = `${index + 1} / ${ANIMALS.length}`;

    if (animal.type === "video") {
      img.hidden = true;
      img.removeAttribute("src");
      video.hidden = false;
      video.poster = animal.thumb;
      video.src = animal.src;
      video.play().catch(() => {});
    } else {
      stopVideo();
      video.hidden = true;
      img.hidden = false;
      img.src = animal.src;
      img.alt = animal.name[lang];
    }

    mediaWrap?.classList.toggle("is-video", animal.type === "video");
  };

  const open = (startIndex) => {
    lastFocus = document.activeElement;
    index = startIndex;
    paint();
    isOpen = true;
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    lightbox.querySelector(".lightbox-close")?.focus();
  };

  const close = () => {
    isOpen = false;
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    stopVideo();
    img.removeAttribute("src");
    lastFocus?.focus();
  };

  const go = (delta) => {
    stopVideo();
    index = (index + delta + ANIMALS.length) % ANIMALS.length;
    paint();
  };

  const onItemClick = (e) => {
    const item = e.target.closest(".marquee-item");
    if (!item) return;
    if (marqueeSuppressClick) {
      marqueeSuppressClick = false;
      return;
    }
    open(Number(item.dataset.index) || 0);
  };

  group.addEventListener("click", onItemClick);
  document.getElementById("animalsMarqueeClone")?.addEventListener("click", onItemClick);

  prevBtn?.addEventListener("click", () => go(-1));
  nextBtn?.addEventListener("click", () => go(1));
  closeEls.forEach((el) => el.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  });

  window.addEventListener("estimacao:lang", () => {
    if (isOpen) paint();
    syncMarqueeLabels();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initAnimalsMarquee();
  initAnimalsLightbox();
});

window.EstimacaoAnimals = { ANIMALS };
