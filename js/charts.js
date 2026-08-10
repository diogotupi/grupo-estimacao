/** Approximate historical series — easy to edit later */
const YEAR_TOTALS = [
  [2003, 237],
  [2004, 347],
  [2005, 568],
  [2006, 641],
  [2007, 712],
  [2008, 783],
  [2009, 854],
  [2010, 921],
  [2011, 1087],
  [2012, 997],
  [2013, 934],
  [2014, 886],
  [2015, 841],
  [2016, 879],
  [2017, 912],
  [2018, 958],
  [2019, 1003],
  [2020, 1046],
  [2021, 1091],
  [2022, 1134],
  [2023, 1168],
  [2024, 1189],
  [2025, 1200],
  [2026, 798],
];

function splitDogsCats(total, year) {
  // ~80% dogs / ~20% cats with slight year-based noise; 2026 pinned near 748 + 150
  if (year === 2026) return { dogs: 748, cats: 150 };
  const noise = ((year * 17) % 9) - 4;
  let dogs = Math.round(total * 0.8) + noise;
  let cats = total - dogs;
  if (cats < 1) {
    cats = 1;
    dogs = total - 1;
  }
  return { dogs, cats };
}

function buildSeries() {
  return YEAR_TOTALS.map(([year, total]) => {
    const { dogs, cats } = splitDogsCats(total, year);
    return { year, dogs, cats };
  });
}

function drawLineChart(canvas, values, color) {
  if (!canvas) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssW = canvas.clientWidth || canvas.width;
  const cssH = Math.max(220, Math.round(cssW * 0.48));
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  canvas.style.height = `${cssH}px`;

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const pad = { top: 18, right: 16, bottom: 36, left: 48 };
  const w = cssW - pad.left - pad.right;
  const h = cssH - pad.top - pad.bottom;
  const max = Math.max(...values.map((v) => v.n)) * 1.08;
  const min = 0;

  ctx.clearRect(0, 0, cssW, cssH);

  // grid
  ctx.strokeStyle = "rgba(47, 111, 156, 0.15)";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#3d5160";
  ctx.font = "600 13px Nunito, sans-serif";
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (h * i) / 4;
    const val = Math.round(max - ((max - min) * i) / 4);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + w, y);
    ctx.stroke();
    ctx.fillText(String(val), 6, y + 4);
  }

  const xAt = (i) => pad.left + (w * i) / (values.length - 1);
  const yAt = (n) => pad.top + h - ((n - min) / (max - min)) * h;

  // area
  ctx.beginPath();
  values.forEach((v, i) => {
    const x = xAt(i);
    const y = yAt(v.n);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(xAt(values.length - 1), pad.top + h);
  ctx.lineTo(xAt(0), pad.top + h);
  ctx.closePath();
  ctx.fillStyle = color.replace("1)", "0.16)");
  ctx.fill();

  // line
  ctx.beginPath();
  values.forEach((v, i) => {
    const x = xAt(i);
    const y = yAt(v.n);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = color;
  ctx.lineWidth = 3.5;
  ctx.lineJoin = "round";
  ctx.stroke();

  // points every few years + last
  values.forEach((v, i) => {
    if (i % 4 !== 0 && i !== values.length - 1) return;
    const x = xAt(i);
    const y = yAt(v.n);
    ctx.beginPath();
    ctx.arc(x, y, i === values.length - 1 ? 5.5 : 3.5, 0, Math.PI * 2);
    ctx.fillStyle = i === values.length - 1 ? "#2f9e5f" : color;
    ctx.fill();
  });

  // x labels
  ctx.fillStyle = "#3d5160";
  ctx.font = "700 12px Nunito, sans-serif";
  values.forEach((v, i) => {
    if (i % 5 !== 0 && i !== values.length - 1) return;
    ctx.fillText(String(v.year), xAt(i) - 14, cssH - 10);
  });
}

function renderCharts() {
  const series = buildSeries();
  const dogs = series.map((s) => ({ year: s.year, n: s.dogs }));
  const cats = series.map((s) => ({ year: s.year, n: s.cats }));
  const last = series[series.length - 1];

  drawLineChart(document.getElementById("chartDogs"), dogs, "rgba(47, 111, 156, 1)");
  drawLineChart(document.getElementById("chartCats"), cats, "rgba(78, 159, 209, 1)");

  const dogsNow = document.getElementById("dogsNow");
  const catsNow = document.getElementById("catsNow");
  if (dogsNow) dogsNow.textContent = String(last.dogs);
  if (catsNow) catsNow.textContent = String(last.cats);
}

document.addEventListener("DOMContentLoaded", () => {
  renderCharts();
  window.addEventListener("resize", () => {
    clearTimeout(renderCharts._t);
    renderCharts._t = setTimeout(renderCharts, 120);
  });
});

window.EstimacaoCharts = { YEAR_TOTALS, buildSeries, renderCharts };
