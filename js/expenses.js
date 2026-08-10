/** Easy to replace when the official table arrives */
const MONTHLY_EXPENSES = [
  { key: "expenses.racao", amount: 40000 },
  { key: "expenses.impostos", amount: 4500 },
  { key: "expenses.meds", amount: 4800 },
  { key: "expenses.staff", amount: 8000 },
  { key: "expenses.vet", amount: 3500 },
  { key: "expenses.maint", amount: 3500 },
  { key: "expenses.debt", amount: 7500 },
];

function formatBRL(n) {
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function renderExpenses() {
  const root = document.getElementById("expensesBars");
  const totalEl = document.getElementById("expensesTotal");
  if (!root) return;

  const total = MONTHLY_EXPENSES.reduce((sum, row) => sum + row.amount, 0);
  const max = Math.max(...MONTHLY_EXPENSES.map((r) => r.amount));
  const lang = window.EstimacaoI18n?.getStoredLang?.() || "pt";

  root.innerHTML = MONTHLY_EXPENSES.map((row) => {
    const label = window.EstimacaoI18n?.t(row.key, lang) || row.key;
    const pct = Math.max(8, Math.round((row.amount / max) * 100));
    return `
      <div class="expense-row">
        <div class="expense-meta">
          <span>${label}</span>
          <span>${formatBRL(row.amount)}</span>
        </div>
        <div class="expense-track" aria-hidden="true">
          <div class="expense-fill" style="width:${pct}%"></div>
        </div>
      </div>
    `;
  }).join("");

  if (totalEl) totalEl.textContent = formatBRL(total);

  // reflow animation
  requestAnimationFrame(() => {
    root.querySelectorAll(".expense-fill").forEach((el) => {
      const w = el.style.width;
      el.style.width = "0";
      requestAnimationFrame(() => {
        el.style.width = w;
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderExpenses();
  window.addEventListener("estimacao:lang", renderExpenses);
});

window.EstimacaoExpenses = { MONTHLY_EXPENSES, renderExpenses };
