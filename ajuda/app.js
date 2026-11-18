(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const config = window.ESTIMACAO_DONATIONS || {};
  const payments = window.EstimacaoPayments;
  const currency = (cents) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const PIX_KEY = "08996430000117";
  const CAMPAIGN_URL = "https://ongestimacao.org/ajuda/";
  const dialog = $("paymentDialog");
  let toastTimer;
  let selectedCents = 5000;
  let lastTrigger;
  const track = (name, element) => window.EstimacaoAnalytics?.track(name, element);

  function feedback(message) {
    if (dialog.open) {
      $("dialogFeedback").textContent = message;
      return;
    }
    clearTimeout(toastTimer);
    $("toast").textContent = message;
    $("toast").hidden = false;
    toastTimer = setTimeout(() => { $("toast").hidden = true; }, 6000);
  }
  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Também funciona em navegadores sem a API Clipboard ou sem permissão.
      const previousFocus = document.activeElement;
      const field = document.createElement("textarea");
      field.value = text;
      field.style.cssText = "position:fixed;left:0;top:0;opacity:0;pointer-events:none";
      (dialog.open ? dialog : document.body).appendChild(field);
      field.select();
      let copied = false;
      try { copied = document.execCommand("copy"); } catch { /* Mostra instrução manual. */ }
      field.remove();
      previousFocus?.focus({ preventScroll: true });
      return copied;
    }
  }
  document.querySelectorAll("[data-copy-pix]").forEach((button) => {
    button.hidden = false;
    button.addEventListener("click", async () => {
      if (await copy(PIX_KEY)) {
        feedback("Chave Pix copiada! Cole no seu banco e escolha o valor.");
        track("pix_copy", button);
      } else feedback("Não foi possível copiar. Use a chave CNPJ 08996430000117 no seu banco.");
    });
  });

  const amountRadios = [...document.querySelectorAll('input[name="amount"]')];
  function updatePaymentCaption() {
    const cents = $("customAmount").value.trim() ? payments.parseAmount($("customAmount").value) : selectedCents;
    $("paymentCaption").textContent = payments.checkoutFor(config, cents)
      ? "Pix direto ou checkout no Pagar.me. Doação avulsa."
      : "Doe via Pix, direto para a ONG.";
  }
  function clearError() {
    $("amountError").hidden = true;
    $("customAmount").removeAttribute("aria-invalid");
  }
  amountRadios.forEach((radio) => radio.addEventListener("change", () => {
    selectedCents = Number(radio.value);
    $("customAmount").value = "";
    clearError();
    updatePaymentCaption();
  }));
  $("customAmount").addEventListener("input", () => {
    const isCustom = $("customAmount").value.trim() !== "";
    amountRadios.forEach((radio) => { radio.checked = !isCustom && Number(radio.value) === selectedCents; });
    clearError();
    updatePaymentCaption();
  });

  function openDonation(trigger) {
    const customValue = $("customAmount").value.trim();
    const cents = customValue ? payments.parseAmount(customValue) : selectedCents;
    if (cents === null) {
      $("amountError").textContent = "Informe um valor entre R$ 1 e R$ 100.000, sem separador de milhar. Ex.: 25,50.";
      $("amountError").hidden = false;
      $("customAmount").setAttribute("aria-invalid", "true");
      $("customAmount").focus();
      return;
    }
    clearError();
    const checkout = payments.checkoutFor(config, cents);
    $("paymentTitle").textContent = `Sua doação de ${currency(cents)}`;
    $("pixAmount").textContent = currency(cents);
    $("checkoutSection").hidden = !checkout;
    $("pixOnlyNote").hidden = Boolean(checkout);
    if (checkout) $("checkoutLink").href = checkout;
    else $("checkoutLink").removeAttribute("href");
    $("dialogFeedback").textContent = "";
    $("toast").hidden = true;
    lastTrigger = trigger;
    dialog.showModal();
    track("donation_options_open", trigger);
  }
  $("donationForm").hidden = false;
  $("donationForm").addEventListener("submit", (event) => {
    event.preventDefault();
    openDonation(event.submitter);
  });
  $("stickyDonate").hidden = false;
  $("stickyDonate").addEventListener("click", (event) => openDonation(event.currentTarget));
  $("closeDialog").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => lastTrigger?.focus({ preventScroll: true }));
  $("checkoutLink").addEventListener("click", (event) => track("donation_checkout_click", event.currentTarget));
  updatePaymentCaption();

  const progress = payments.campaignProgress(config);
  if (progress) {
    $("raisedValue").textContent = currency(progress.raisedCents);
    $("campaignProgress").value = progress.percent;
    $("goalValue").textContent = `Meta: ${currency(progress.goalCents)}`;
    $("updatedAt").textContent = `Atualizado pela ONG em ${progress.updatedAt.split("-").reverse().join("/")}.`;
    $("fundraising").hidden = false;
  }

  const photos = [
    { src: "../assets/quem-somos.png", alt: "Equipe do Grupo Estimação com cães no abrigo, em Teresópolis" },
    { src: "../assets/media/hero-dog-poster.jpg", alt: "Vista aérea das instalações do abrigo SOS Animal, cercadas pela mata em Teresópolis" },
  ];
  document.querySelector(".photo-controls").hidden = false;
  document.querySelectorAll("[data-photo]").forEach((button) => button.addEventListener("click", () => {
    const photo = photos[Number(button.dataset.photo)];
    $("campaignPhoto").src = photo.src;
    $("campaignPhoto").alt = photo.alt;
    document.querySelectorAll("[data-photo]").forEach((item) => {
      item.classList.toggle("active", item === button);
      item.setAttribute("aria-pressed", String(item === button));
    });
  }));
  $("shareCampaign").hidden = false;
  $("shareCampaign").addEventListener("click", async (event) => {
    const trigger = event.currentTarget;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Ajude o Grupo Estimação", text: "O resgate é só o começo. Ajude a cuidar dos animais do abrigo.", url: CAMPAIGN_URL });
        track("campaign_share", trigger);
        return;
      } catch (error) { if (error.name === "AbortError") return; }
    }
    if (await copy(CAMPAIGN_URL)) {
      feedback("Link da campanha copiado. Compartilhe com quem também ama os animais!");
      track("campaign_share", trigger);
    } else feedback(`Compartilhe este endereço: ${CAMPAIGN_URL}`);
  });
})();
