/* Helpers puros, compartilhados pela página e pelos testes. */
(function (root) {
  "use strict";
  const MIN_CENTS = 100;
  const MAX_CENTS = 10000000;
  function validAmount(cents) {
    return Number.isSafeInteger(cents) && cents >= MIN_CENTS && cents <= MAX_CENTS;
  }
  function parseAmount(value) {
    const normalized = String(value).trim();
    // Aceita reais sem separador de milhar, com vírgula ou ponto decimal.
    if (!/^\d{1,6}(?:[.,]\d{1,2})?$/.test(normalized)) return null;
    const [whole, fraction = ""] = normalized.split(/[.,]/);
    const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
    return validAmount(cents) ? cents : null;
  }
  function safeCheckoutUrl(value) {
    if (typeof value !== "string" || !value.trim()) return null;
    try {
      const url = new URL(value);
      const allowed = ["payment-link.pagar.me", "checkout.pagar.me", "doacoes.pagar.me"];
      if (url.protocol !== "https:" || !allowed.includes(url.hostname) ||
          url.username || url.password || url.port || url.pathname === "/") return null;
      return url.href;
    } catch { return null; }
  }
  function checkoutFor(config, cents) {
    const payment = config?.pagarme;
    if (payment?.enabled !== true || !validAmount(cents)) return null;
    if (Object.prototype.hasOwnProperty.call(payment.links || {}, String(cents))) {
      return safeCheckoutUrl(payment.links[String(cents)]);
    }
    if (typeof payment.donationSlug !== "string" ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payment.donationSlug) ||
        !Array.isArray(payment.donationAmounts) || cents % 100 !== 0 ||
        !payment.donationAmounts.includes(cents / 100)) return null;
    return `https://doacoes.pagar.me/${payment.donationSlug}/doe-${cents / 100}`;
  }
  function campaignProgress(config) {
    const c = config?.campaign;
    if (!c || !Number.isSafeInteger(c.goalCents) || c.goalCents <= 0 ||
        !Number.isSafeInteger(c.raisedCents) || c.raisedCents < 0 ||
        !/^\d{4}-\d{2}-\d{2}$/.test(c.updatedAt)) return null;
    const date = new Date(`${c.updatedAt}T12:00:00Z`);
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== c.updatedAt) return null;
    return { ...c, percent: Math.min(100, c.raisedCents / c.goalCents * 100) };
  }
  const api = { parseAmount, safeCheckoutUrl, checkoutFor, campaignProgress };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.EstimacaoPayments = api;
})(typeof window !== "undefined" ? window : globalThis);
