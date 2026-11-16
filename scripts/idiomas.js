// ================= LÍNGUAS (PT / EN) =================
// O texto original está em português. Este dicionário dá a versão inglesa.
// Textos com {nome} recebem valores (ex.: t("Poupas {v} por ano.", { v: "100 €" })).

const INGLES = {
  // Topo
  "Compensa trocar de carro?": "Is it worth switching cars?",
  "Compara o que gastas por ano com o teu carro e com um carro novo. O resultado atualiza enquanto escreves.":
    "Compare what you spend each year on your car and on a new one. The result updates as you type.",
  "Quantos km fazes por ano?": "How many km do you drive a year?",
  "Km por ano": "Km per year",
  "Língua": "Language",

  // Carros
  "Carro atual": "Current car",
  "Carro novo": "New car",
  "Combustão": "Combustion",
  "Elétrico": "Electric",
  "Modelo": "Model",
  "opcional, preenche o consumo": "optional, fills in the consumption",
  "Versão": "Version",
  "Escolhe a versão": "Choose the version",
  "Escolhe o ano primeiro": "Choose the year first",
  "Consumo oficial EPA (EUA) para {carro}. Ajusta se souberes o valor real.":
    "Official EPA (US) consumption for {carro}. Change it if you know the real value.",
  "Dados dos veículos: fueleconomy.gov (Agência de Proteção Ambiental e Departamento de Energia dos EUA). Só inclui carros vendidos nos EUA e o consumo é o do teste americano. As marcas pertencem aos seus donos; este site não tem ligação a nenhuma marca.":
    "Vehicle data: fueleconomy.gov (US Environmental Protection Agency and Department of Energy). Only includes cars sold in the US, with consumption from the US test. Brands belong to their owners; this site has no link to any brand.",
  "Marca": "Make",
  "Ano": "Year",
  "Combustível": "Fuel",
  "Motor": "Engine",
  "Energia": "Energy",
  "Consumo": "Consumption",
  "Preço do combustível": "Fuel price",
  "Preço da eletricidade": "Electricity price",
  "Eletricidade": "Electricity",
  "Custos fixos por ano": "Fixed costs per year",
  "Seguro": "Insurance",
  "IUC": "Road tax (IUC)",
  "Manutenção": "Maintenance",
  "Inspeção": "Inspection",
  "Quanto consegues pela venda?": "How much will you get for it?",
  "Quanto custa o carro novo?": "How much does the new car cost?",
  "meses": "months",

  // Listas
  "A carregar…": "Loading…",
  "Escolhe a marca": "Choose the make",
  "Escolhe o modelo": "Choose the model",
  "Escolhe o ano": "Choose the year",
  "Escolhe o combustível": "Choose the fuel",
  "Escolhe a marca primeiro": "Choose the make first",
  "Escolhe o modelo primeiro": "Choose the model first",
  "Escolhe o combustível primeiro": "Choose the fuel first",
  "Todos os motores": "All engines",
  "Sem versões na API": "No versions in the API",
  "Não foi possível carregar": "Couldn't load",
  "Sem resultados": "No results",
  "Gasolina": "Petrol",
  "Gasóleo": "Diesel",
  "Híbrido": "Hybrid",

  // Consumo estimado
  "A estimar o consumo…": "Estimating consumption…",
  "Escolhe o motor para estimar o consumo.": "Choose the engine to estimate consumption.",
  "Não há dados para estimar o consumo deste modelo. Escreve o valor que conheces.":
    "There's no data to estimate this model's consumption. Enter the value you know.",
  "Estimativa para {carro}. Ajusta se souberes o valor real.": "Estimate for {carro}. Change it if you know the real value.",
  " de {ano}": " from {ano}",

  // Apoio à compra
  "Apoio à compra": "Purchase support",
  "Sem apoio": "No support",
  "Fundo Ambiental: 4000 €": "Fundo Ambiental: €4,000",
  "Famílias com tarifa social: até 80%": "Social tariff households: up to 80%",
  "Percentagem do apoio (sobre o preço sem IVA)": "Support percentage (of the price before VAT)",
  "Estes apoios são só para carros 100% elétricos.": "These schemes are only for 100% electric cars.",
  "O preço passa o limite de 38 500 € (55 000 € para carros com mais de 5 lugares), por isso não há apoio.":
    "The price is over the €38,500 limit (€55,000 for cars with more than 5 seats), so there's no support.",
  "Exige abater um carro a combustível com mais de 10 anos. A última fase fechou a 27 de julho de 2026; confirma se há nova fase no Fundo Ambiental.":
    "Requires scrapping a fuel car over 10 years old. The last round closed on 27 July 2026; check the Fundo Ambiental for a new one.",
  "Calculado sobre o preço sem IVA ({v}). Anunciado em outubro de 2026 para o Orçamento do Estado de 2027; as regras e o valor máximo ainda não foram publicados, por isso trata isto como uma simulação.":
    "Calculated on the price before VAT ({v}). Announced in October 2026 for the 2027 State Budget; the rules and maximum amount aren't published yet, so treat this as a simulation.",

  // Crédito
  "Como vais pagar?": "How will you pay?",
  "A pronto": "Upfront",
  "Com crédito (prestações)": "With a loan (monthly payments)",
  "Entrada": "Down payment",
  "Prazo": "Term",
  "Taxa de juro anual (TAN)": "Annual interest rate",
  "A venda do teu carro, o apoio e a entrada já pagam o carro novo: não precisas de crédito.":
    "Selling your car, the support and the down payment already cover the new car: you don't need a loan.",
  "Vais financiar {v}. A prestação é uma estimativa: o banco pode juntar seguros e comissões (vê a TAEG).":
    "You'll borrow {v}. The payment is an estimate: the bank may add insurance and fees (check the APR).",
  "Prestação": "Monthly payment",
  "por mês, durante {n} meses": "per month, for {n} months",
  "Juros no total": "Total interest",
  "sobre {v}": "on {v}",
  "ficas com mais {v} por mês": "you have {v} more each month",
  "gastas mais {v} por mês": "you spend {v} more each month",
  "Enquanto pagas o crédito, os custos do carro baixam {c} por mês e pagas {p} de prestação: {efeito}.":
    "While you pay off the loan, car costs drop by {c} a month and you pay {p} a month: {efeito}.",

  // Resultado
  "Resultado": "Result",
  "Tempo até a troca se pagar": "Time until the switch pays off",
  "Não compensa": "Not worth it",
  "Compensa já": "Worth it right away",
  "Compensa": "Worth it",
  "Compensa, mas demora": "Worth it, but it takes a while",
  "O carro novo custa mais {v} por ano a manter. Só pelos custos, a troca nunca se paga.":
    "The new car costs {v} more a year to run. On running costs alone, the switch never pays off.",
  "A venda do teu carro cobre a compra e ainda poupas {v} por ano.":
    "Selling your car covers the purchase and you still save {v} a year.",
  "Poupas {v} por ano.": "You save {v} a year.",
  "O investimento de {v}": "The investment of {v}",
  ", já com o apoio de {v},": ", after {v} of support,",
  " (inclui {v} de juros)": " (including {v} in interest)",
  " fica pago ao fim de {n} anos.": " pays off after {n} years.",
  "{titulo}: {n} anos": "{titulo}: {n} years",
  "nunca se paga": "never pays off",
  "anos": "years",
  "20+ anos": "20+ years",
  "Atual": "Current",
  "Novo": "New",
  "Poupas": "You save",
  "Custo": "Cost",
  "Total por ano": "Total per year",
  "Total por mês": "Total per month",
  "Combustível / energia": "Fuel / energy",
  "Por mês: combustível": "Per month: fuel",
  "Por mês: combustível + prestação": "Per month: fuel + loan payment",
  "Custos por ano de cada carro e quanto poupas": "Yearly costs of each car and how much you save",
  "Custo acumulado": "Cumulative cost",
  "Quanto gastas ao longo dos anos. O carro novo já inclui a compra.":
    "What you spend over the years. The new car includes the purchase.",
  "Hoje": "Today",
  "{n}a": "{n}y",
  "Paga-se aqui, ao fim de {n} anos": "Pays off here, after {n} years",
  "Custo acumulado dos dois carros ao longo de {n} anos": "Cumulative cost of both cars over {n} years",
  "Ano {n}": "Year {n}",
  "Diferença: {v}": "Difference: {v}",
  "Anos no gráfico": "Years shown",
  "Auto": "Auto",
  "Passa o rato (ou o dedo) pelo gráfico para ver cada ano. Carrega na legenda para esconder uma linha.":
    "Hover (or tap) the chart to see each year. Click the legend to hide a line.",

  // Fim da página
  "Os valores de partida são estimativas. Ajusta-os à tua realidade.":
    "The starting values are estimates. Adjust them to your situation.",
  "Ver detalhes": "See details",
  "Dados dos veículos: API Ninjas.": "Vehicle data: API Ninjas.",
  "Os valores são estimativas para orientação e não são aconselhamento financeiro. As regras dos apoios do Estado podem mudar: confirma sempre no Fundo Ambiental.":
    "Values are estimates for guidance only and are not financial advice. State support rules may change: always check with the Fundo Ambiental.",
  "Privacidade: este site não usa cookies nem recolhe dados pessoais. A língua escolhida fica guardada só no teu browser. Se escolheres um carro, o teu browser pede os dados ao fueleconomy.gov (governo dos EUA).":
    "Privacy: this site uses no cookies and collects no personal data. Your language choice is stored only in your browser. If you choose a car, your browser requests its data from fueleconomy.gov (US government).",
  "© 2026 vitorwlm. Todos os direitos reservados. Feito em Portugal 🇵🇹": "© 2026 vitorwlm. All rights reserved. Made in Portugal 🇵🇹",
  "Tipo de energia": "Energy type",
  "Compara os custos anuais do teu carro com um carro novo e descobre em quantos anos a troca se paga.":
    "Compare your car's yearly costs with a new car's and find out how many years the switch takes to pay off.",
};

// Do inglês de volta ao português (para trocar de EN para PT)
const PORTUGUES = Object.fromEntries(Object.entries(INGLES).map(([pt, en]) => [en, pt]));

export let lingua = localStorage.getItem("lingua") === "en" ? "en" : "pt";

// Formato dos números e moeda de cada língua
export function local() {
  return lingua === "en" ? "en-IE" : "pt-PT";
}

// Traduz um texto (escrito em português) para a língua escolhida
export function t(texto, valores) {
  let saida = lingua === "en" && INGLES[texto] !== undefined ? INGLES[texto] : texto;
  for (const nome in valores || {}) saida = saida.split("{" + nome + "}").join(valores[nome]);
  return saida;
}

// Traduz o texto que já está na página (HTML fixo e listas)
function traduzirPagina() {
  const percorrer = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let no = percorrer.nextNode(); no; no = percorrer.nextNode()) {
    if (no.parentElement.closest("script, #resultado, #evolucao")) continue;
    const limpo = no.nodeValue.trim();
    if (!limpo) continue;
    const original = PORTUGUES[limpo] || limpo;
    const novo = t(original);
    if (novo !== limpo) no.nodeValue = no.nodeValue.replace(limpo, novo);
  }

  // Atributos com texto
  document.querySelectorAll("[aria-label]").forEach(function (el) {
    const atual = el.getAttribute("aria-label");
    el.setAttribute("aria-label", t(PORTUGUES[atual] || atual));
  });
  const descricao = document.querySelector('meta[name="description"]');
  const textoDescricao = descricao.getAttribute("content");
  descricao.setAttribute("content", t(PORTUGUES[textoDescricao] || textoDescricao));
  document.title = t(PORTUGUES[document.title] || document.title);
  document.documentElement.lang = lingua;

  document.querySelectorAll("[data-lingua]").forEach(function (botao) {
    botao.setAttribute("aria-pressed", botao.dataset.lingua === lingua);
  });
}

// Botões PT / EN
function mudarLingua(nova) {
  lingua = nova;
  localStorage.setItem("lingua", nova);
  traduzirPagina();
  document.dispatchEvent(new Event("mudou-lingua"));
}

document.querySelectorAll("[data-lingua]").forEach(function (botao) {
  botao.addEventListener("click", function () {
    mudarLingua(botao.dataset.lingua);
  });
});

traduzirPagina();
