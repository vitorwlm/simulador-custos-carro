// ================= CÁLCULO =================
// Custos anuais, crédito (prestação e juros) e apoios do Estado.

import { num, euros } from "./formatar.js";
import { t } from "./idiomas.js";

// Custos anuais de um carro ("atual" ou "novo"), linha a linha
export function custos(carro, km) {
  const linhas = {
    "Energia": km / 100 * num("consumo-" + carro) * num("preco-energia-" + carro),
    "Seguro": num("seguro-" + carro),
    "IUC": num("iuc-" + carro),
    "Manutenção": num("manutencao-" + carro),
    "Inspeção": num("inspecao-" + carro),
  };
  const total = Object.values(linhas).reduce((a, b) => a + b, 0);
  return { linhas: linhas, total: total };
}

// Crédito: prestação mensal (sistema francês, prestações iguais) e juros totais.
// Devolve null se a pessoa paga a pronto ou se não há nada a financiar.
export function credito(emFalta) {
  const comCredito = document.getElementById("pagamento").value === "credito";
  const dica = document.getElementById("dica-credito");
  document.getElementById("credito-campos").hidden = !comCredito;
  dica.textContent = "";
  if (!comCredito) return null;

  const financiado = Math.max(0, emFalta - num("entrada"));
  if (financiado <= 0) {
    dica.textContent = t("A venda do teu carro, o apoio e a entrada já pagam o carro novo: não precisas de crédito.");
    return null;
  }

  const meses = Math.max(1, Math.round(num("prazo")));
  const taxaMes = num("tan") / 100 / 12;
  const prestacao = taxaMes ? financiado * taxaMes / (1 - Math.pow(1 + taxaMes, -meses)) : financiado / meses;
  dica.textContent = t("Vais financiar {v}. A prestação é uma estimativa: o banco pode juntar seguros e comissões (vê a TAEG).", { v: euros(financiado) });
  return { financiado: financiado, meses: meses, prestacao: prestacao, juros: prestacao * meses - financiado };
}

// Apoio do Estado à compra do carro novo (só para 100% elétricos)
export function apoioCompra() {
  const tipo = document.getElementById("apoio-novo").value;
  const preco = num("preco-compra-novo");
  const eletrico = document.getElementById("tipo-novo").dataset.energia === "eletrico";
  const dica = document.getElementById("dica-apoio");
  document.getElementById("apoio-pct-rotulo").hidden = tipo !== "social";

  if (tipo === "nenhum") {
    dica.textContent = "";
    return 0;
  }
  if (!eletrico) {
    dica.textContent = t("Estes apoios são só para carros 100% elétricos.");
    return 0;
  }

  if (tipo === "fundo") {
    if (preco > 38500) {
      dica.textContent = t("O preço passa o limite de 38 500 € (55 000 € para carros com mais de 5 lugares), por isso não há apoio.");
      return 0;
    }
    dica.textContent = t("Exige abater um carro a combustível com mais de 10 anos. A última fase fechou a 27 de julho de 2026; confirma se há nova fase no Fundo Ambiental.");
    return Math.min(4000, preco);
  }

  // Tarifa social: anunciado, ainda sem regras. A percentagem aplica-se ao preço sem IVA (23%).
  const pct = Math.min(80, num("apoio-pct"));
  const semIva = preco / 1.23;
  dica.textContent = t("Calculado sobre o preço sem IVA ({v}). Anunciado em outubro de 2026 para o Orçamento do Estado de 2027; as regras e o valor máximo ainda não foram publicados, por isso trata isto como uma simulação.", { v: euros(semIva) });
  return semIva * pct / 100;
}
