const translations = {
  pt: {
    "a11y.skip": "Ir para o conteúdo",
    "nav.about": "Quem somos",
    "nav.supporter": "Apoiar",
    "nav.numbers": "Números",
    "nav.animals": "Cases",
    "nav.expenses": "Gastos",
    "nav.donate": "Doar",
    "hero.title": "HÁ MAIS DE 20 ANOS SALVANDO VIDAS.",
    "hero.lead": "Teresópolis, Rio de Janeiro. Cada doação alimenta e cuida de quem foi resgatado.",
    "about.title": "Quem somos",
    "about.photoCaption": "Nossa equipe em Teresópolis",
    "about.p1":
      "O Grupo Estimação / SOS Animal foi fundado por Bebete Filpi e fica em Teresópolis, no estado do Rio de Janeiro. Há mais de 20 anos resgatamos animais em situação de risco nas ruas.",
    "about.p2":
      "Em 2011, na grande enchente de Teresópolis, o grupo foi às ruas desde as primeiras horas. Quase dois mil animais precisaram de ajuda. Muita gente não olhava para os bichos. Nós olhamos.",
    "about.p3":
      "Depois da tragédia, assumimos o santuário SOS Animal, no Parque dos Três Picos, para continuar cuidando de quem foi resgatado. Seguimos sem ajuda do governo, contando com a solidariedade de pessoas como você.",
    "supporter.title": "Seja um apoiador mensal!",
    "supporter.p1":
      "Com uma contribuição todo mês, você ajuda a garantir ração, remédios e cuidado para dezenas de animais. É simples, seguro e faz diferença de verdade no abrigo.",
    "supporter.p2":
      "Qualquer valor ajuda. Quanto mais pessoas apoiam todos os meses, menos precisamos recorrer a empréstimos para manter o trabalho.",
    "supporter.cta": "Quero apoiar todo mês",
    "charts.title": "Acompanhe o número de animais",
    "charts.estimate": "Estimativa",
    "charts.note":
      "Os números abaixo são estimativas ao longo dos anos. Servem para mostrar o tamanho do nosso cuidado, não um censo oficial.",
    "charts.dogs": "Cães",
    "charts.cats": "Gatos",
    "charts.now": "Estimativa agora (2026):",
    "animals.title": "Cases de resgate",
    "animals.lead": "Toque em uma foto ou vídeo para ver a história.",
    "animals.cta":
      "Esses são apenas alguns dos mais de 10.000 animais que já passaram por nossos cuidados. Faça parte disso você também! Contribua através do pix, ou torne-se um apoiador no apoia-se!",
    "expenses.title": "Gastos do mês",
    "expenses.totalLabel": "Total estimado",
    "expenses.note":
      "Muitas vezes precisamos recorrer a empréstimos. Não temos nenhuma ajuda do governo e as doações quase nunca cobrem todos os custos.",
    "expenses.racao": "Ração",
    "expenses.impostos": "Impostos",
    "expenses.meds": "Medicamentos e Vacinas",
    "expenses.staff": "Colaboradores",
    "expenses.vet": "Veterinário",
    "expenses.maint": "Imprevistos e Manutenções",
    "expenses.debt": "Débitos e Dívidas bancárias",
    "pix.copy": "COPIAR CÓDIGO PIX",
    "pix.barHint": "Ajude com qualquer valor",
    "pix.toast":
      "Prontinho! É só abrir o aplicativo do seu banco e colar o pix com o valor que desejar.",
    "footer.tagline": "Teresópolis, RJ. Resgatando e cuidando há mais de 20 anos.",
    "footer.contact": "Contato",
    "footer.help": "Ajude agora",
  },
  en: {
    "a11y.skip": "Skip to content",
    "nav.about": "About us",
    "nav.supporter": "Support",
    "nav.numbers": "Numbers",
    "nav.animals": "Cases",
    "nav.expenses": "Costs",
    "nav.donate": "Donate",
    "hero.title": "FOR OVER 20 YEARS SAVING LIVES.",
    "hero.lead": "Teresópolis, Rio de Janeiro. Every donation feeds and cares for rescued animals.",
    "about.title": "About us",
    "about.photoCaption": "Our team in Teresópolis",
    "about.p1":
      "Grupo Estimação / SOS Animal was founded by Bebete Filpi and is based in Teresópolis, in the state of Rio de Janeiro. For over 20 years we have been rescuing animals at risk on the streets.",
    "about.p2":
      "In 2011, during the great flood in Teresópolis, the group went out from the very first hours. Almost two thousand animals needed help. Many people did not look at the animals. We did.",
    "about.p3":
      "After the tragedy, we took on the SOS Animal sanctuary in the Três Picos State Park to keep caring for those we rescued. We still receive no government help and rely on people like you.",
    "supporter.title": "Become a monthly supporter!",
    "supporter.p1":
      "With a monthly gift, you help guarantee food, medicine, and care for dozens of animals. It is simple, safe, and truly makes a difference at the shelter.",
    "supporter.p2":
      "Any amount helps. The more people support every month, the less we need loans to keep the work going.",
    "supporter.cta": "I want to support every month",
    "charts.title": "Follow the number of animals",
    "charts.estimate": "Estimate",
    "charts.note":
      "The numbers below are estimates over the years. They show the scale of our care, not an official census.",
    "charts.dogs": "Dogs",
    "charts.cats": "Cats",
    "charts.now": "Estimate now (2026):",
    "animals.title": "Rescue cases",
    "animals.lead": "Tap a photo or video to see the story.",
    "animals.cta":
      "These are just some of the more than 10,000 animals that have already been in our care. Be part of this too! Contribute via PIX, or become a monthly supporter on Apoia.se!",
    "expenses.title": "Monthly costs",
    "expenses.totalLabel": "Estimated total",
    "expenses.note":
      "We often need to take out loans. We get no government help, and donations almost never cover all our costs.",
    "expenses.racao": "Food",
    "expenses.impostos": "Taxes",
    "expenses.meds": "Medicine and Vaccines",
    "expenses.staff": "Staff",
    "expenses.vet": "Veterinarian",
    "expenses.maint": "Emergencies and Maintenance",
    "expenses.debt": "Bank Debts and Loans",
    "pix.copy": "COPY PIX CODE",
    "pix.barHint": "Help with any amount",
    "pix.toast":
      "Done! Just open your bank app and paste the PIX code with any amount you wish.",
    "footer.tagline": "Teresópolis, RJ. Rescuing and caring for over 20 years.",
    "footer.contact": "Contact",
    "footer.help": "Help now",
  },
};

const LANG_KEY = "estimacao-lang";
const DEFAULT_LANG = "pt";

function getStoredLang() {
  const stored = localStorage.getItem(LANG_KEY);
  return translations[stored] ? stored : DEFAULT_LANG;
}

function t(key, lang = getStoredLang()) {
  return translations[lang]?.[key] ?? translations.pt[key] ?? key;
}

function setLang(lang) {
  if (!translations[lang]) return;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const text = translations[lang][key];
    if (text === undefined) return;
    el.textContent = text;
  });

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    const active = btn.dataset.lang === lang;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
  });

  document.title =
    lang === "pt"
      ? "Grupo Estimação / SOS Animal"
      : "Grupo Estimação / SOS Animal";

  window.dispatchEvent(new CustomEvent("estimacao:lang", { detail: { lang } }));
}

document.addEventListener("DOMContentLoaded", () => {
  setLang(getStoredLang());
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
});

window.EstimacaoI18n = { setLang, getStoredLang, t, translations };
