// ================= GRÁFICO (Chart.js) =================
// Custo acumulado de cada carro, ano a ano, com o ponto onde a troca se paga.
// Interativo: dica ao passar o rato, legenda que esconde linhas e escolha de quantos anos mostrar.

import { euros, eurosCurtos, decimal } from "./formatar.js";
import { t } from "./idiomas.js";

// Chart.js vem de scripts/vendor/chart.umd.js (carregado no index.html antes deste módulo)
const { Chart } = window;

const HORIZONTES = ["auto", 5, 10, 15, 20];
let horizonte = "auto";
let grafico = null;
let ultimo = null; // últimos dados, para redesenhar quando se muda o horizonte

// Cores e letra vêm do CSS, para o gráfico combinar com o resto da página
function cor(nome) {
  return getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
}

// Linha tracejada, ponto e texto no ano em que a troca se paga
const pontoRetorno = {
  id: "pontoRetorno",
  afterDatasetsDraw(chart) {
    const { anos, valor } = chart.options.plugins.pontoRetorno;
    if (!anos || anos > chart.scales.x.max) return;
    const { ctx, chartArea, scales } = chart;
    const x = scales.x.getPixelForValue(anos);
    const y = scales.y.getPixelForValue(valor);

    ctx.save();
    ctx.strokeStyle = cor("--texto");
    ctx.globalAlpha = 0.4;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, chartArea.bottom);
    ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
    ctx.lineWidth = 3;
    ctx.fillStyle = cor("--superficie");
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = cor("--texto");
    ctx.font = "700 12px " + cor("--fonte");
    ctx.textAlign = x > chartArea.left + chartArea.width * 0.7 ? "right" : "center";
    ctx.fillText(t("Paga-se aqui, ao fim de {n} anos", { n: decimal(anos) }), x, y - 16);
    ctx.restore();
  },
};

// Estrutura fixa da secção (só é criada uma vez)
function montar() {
  const seccao = document.getElementById("evolucao");
  seccao.innerHTML = `
    <div class="evolucao__topo">
      <div>
        <h2 class="evolucao__titulo"></h2>
        <p class="evolucao__sub"></p>
      </div>
      <div class="segmentos" role="group" id="horizontes">
        ${HORIZONTES.map(h => `<button type="button" data-horizonte="${h}"></button>`).join("")}
      </div>
    </div>
    <div class="grafico"><canvas id="grafico-canvas" role="img"></canvas></div>
    <p class="evolucao__ajuda"></p>`;

  seccao.querySelectorAll("[data-horizonte]").forEach(function (botao) {
    botao.addEventListener("click", function () {
      horizonte = botao.dataset.horizonte === "auto" ? "auto" : Number(botao.dataset.horizonte);
      desenharGrafico(...ultimo);
    });
  });

  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  grafico = new Chart(document.getElementById("grafico-canvas"), {
    type: "line",
    data: { datasets: [] },
    plugins: [pontoRetorno],
    options: {
      maintainAspectRatio: false,
      animation: reduzir ? false : { duration: 300 },
      interaction: { mode: "index", intersect: false },
      elements: { point: { radius: 0, hoverRadius: 5 }, line: { borderWidth: 3 } },
      scales: {
        x: { type: "linear", min: 0 },
        y: { beginAtZero: true },
      },
      plugins: {
        pontoRetorno: {},
        legend: { labels: { usePointStyle: true, pointStyle: "line", boxWidth: 24 } },
        tooltip: {
          padding: 12,
          callbacks: {
            title: itens => itens[0].parsed.x === 0 ? t("Hoje") : t("Ano {n}", { n: itens[0].parsed.x }),
            label: item => " " + item.dataset.label + ": " + euros(item.parsed.y),
            footer: itens => itens.length === 2
              ? t("Diferença: {v}", { v: euros(Math.abs(itens[0].parsed.y - itens[1].parsed.y)) })
              : "",
          },
        },
      },
    },
  });
}

// Desenha (ou atualiza) o gráfico com os valores atuais
export function desenharGrafico(atual, novo, investimento, anosRetorno) {
  ultimo = [atual, novo, investimento, anosRetorno];
  if (!grafico) montar();

  // Quantos anos mostrar: escolhidos pela pessoa, ou 10 (mais se o retorno for mais tarde, até 20)
  let total = horizonte;
  if (total === "auto") total = anosRetorno && anosRetorno > 8 ? Math.min(20, Math.ceil(anosRetorno) + 2) : 10;

  const anos = Array.from({ length: total + 1 }, (_, i) => i);
  const texto = cor("--texto"), suave = cor("--suave"), linha = cor("--linha"), fonte = cor("--fonte");

  grafico.data.datasets = [
    { label: t("Carro atual"), data: anos.map(a => ({ x: a, y: atual.total * a })), borderColor: cor("--atual"), backgroundColor: cor("--atual") },
    { label: t("Carro novo"), data: anos.map(a => ({ x: a, y: investimento + novo.total * a })), borderColor: cor("--novo"), backgroundColor: cor("--novo") },
  ];

  const o = grafico.options;
  o.font = { family: fonte };
  Chart.defaults.font.family = fonte;
  Chart.defaults.color = suave;
  o.scales.x.max = total;
  o.scales.x.grid = { color: linha };
  o.scales.x.ticks = { color: suave, stepSize: total > 10 ? 2 : 1, callback: v => v === 0 ? t("Hoje") : t("{n}a", { n: v }) };
  o.scales.y.grid = { color: linha };
  o.scales.y.ticks = { color: suave, callback: v => eurosCurtos(v) };
  o.plugins.legend.labels.color = texto;
  o.plugins.pontoRetorno = { anos: anosRetorno, valor: anosRetorno ? atual.total * anosRetorno : 0 };
  o.plugins.tooltip.backgroundColor = cor("--campo");
  o.plugins.tooltip.borderColor = cor("--linha");
  o.plugins.tooltip.borderWidth = 1;
  o.plugins.tooltip.titleColor = texto;
  o.plugins.tooltip.bodyColor = texto;
  o.plugins.tooltip.footerColor = suave;
  grafico.update();

  // Textos (mudam com a língua)
  const seccao = document.getElementById("evolucao");
  seccao.querySelector(".evolucao__titulo").textContent = t("Custo acumulado");
  seccao.querySelector(".evolucao__sub").textContent = t("Quanto gastas ao longo dos anos. O carro novo já inclui a compra.");
  seccao.querySelector(".evolucao__ajuda").textContent = t("Passa o rato (ou o dedo) pelo gráfico para ver cada ano. Carrega na legenda para esconder uma linha.");
  document.getElementById("horizontes").setAttribute("aria-label", t("Anos no gráfico"));
  document.getElementById("grafico-canvas").setAttribute("aria-label", t("Custo acumulado dos dois carros ao longo de {n} anos", { n: total }));
  seccao.querySelectorAll("[data-horizonte]").forEach(function (botao) {
    const h = botao.dataset.horizonte;
    botao.textContent = h === "auto" ? t("Auto") : t("{n}a", { n: h });
    botao.setAttribute("aria-pressed", String(h === String(horizonte)));
  });
}
