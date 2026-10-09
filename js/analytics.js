(() => {
  "use strict";

  const MEASUREMENT_ID = "G-V1K9QDGH6T";
  const CONSENT_KEY = "estimacao-analytics-consent";
  const CONSENT_MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  const production = ["ongestimacao.org", "www.ongestimacao.org"].includes(location.hostname);
  const disableKey = `ga-disable-${MEASUREMENT_ID}`;
  let consent = null;
  let started = false;

  try {
    const saved = JSON.parse(localStorage.getItem(CONSENT_KEY));
    if (saved && Date.now() - saved.at < CONSENT_MAX_AGE &&
        ["granted", "denied"].includes(saved.value)) consent = saved.value;
  } catch { /* If storage is unavailable, ask again on the next visit. */ }

  window[disableKey] = consent !== "granted";
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  function start() {
    if (!production || started || consent !== "granted") return;
    started = true;
    window[disableKey] = false;
    window.gtag("consent", "update", { analytics_storage: "granted" });
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 60 * 24 * 60 * 60,
    });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  function removeAnalyticsCookies() {
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.trim().split("=")[0];
      if (!/^_ga(?:_|$)/.test(name)) return;
      ["", `; domain=${location.hostname}`, "; domain=ongestimacao.org", "; domain=.ongestimacao.org"].forEach((domain) => {
        document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax`;
      });
    });
  }

  function choose(value) {
    consent = value;
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ value, at: Date.now() })); } catch {}
    document.getElementById("cookiePanel").hidden = true;
    if (value === "granted") {
      window[disableKey] = false;
      if (started) window.gtag("consent", "update", { analytics_storage: "granted" });
      else start();
    } else {
      window[disableKey] = true;
      removeAnalyticsCookies();
      // Unload an already-active tag so no subsequent automatic events are sent.
      if (started) location.reload();
    }
  }

  function track(name, element) {
    if (!production || !started || consent !== "granted") return;
    let placement = "other";
    if (element?.closest(".pix-bar")) placement = "fixed_bar";
    else if (element?.closest(".footer")) placement = "footer";
    else placement = element?.closest("section")?.id || placement;
    window.gtag("event", name, {
      button_location: placement,
      site_language: document.documentElement.lang,
    });
  }

  function init() {
    const panel = document.getElementById("cookiePanel");
    panel.hidden = consent !== null;
    document.getElementById("acceptAnalytics").addEventListener("click", () => choose("granted"));
    document.getElementById("rejectAnalytics").addEventListener("click", () => choose("denied"));
    document.getElementById("privacySettings").addEventListener("click", () => {
      panel.hidden = false;
      document.getElementById("rejectAnalytics").focus();
    });
    document.querySelectorAll('a[href="https://apoia.se/grupoestimacao"]').forEach((link) => {
      link.addEventListener("click", () => track("monthly_donor_click", link));
    });
    if (consent !== "granted") removeAnalyticsCookies();
    start();
  }

  window.EstimacaoAnalytics = { track };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
