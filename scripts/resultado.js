// ================= RESULTADO =================
// Junta tudo: conclusão, mostrador, crédito, tabela e gráfico.

import { num, euros, decimal, eurosRedondos } from "./formatar.js";
import { custos, credito, apoioCompra } from "./calculo.js";
import { desenharGrafico } from "./grafico.js";
import { t } from "./idiomas.js";

export function calcular() {
  const km = num("km-ano");
  const atual = custos("atual", km);
  const novo = custos("novo", km);
  const poupanca = atual.total - novo.total;
  const apoio = apoioCompra();
  const emFalta = num("preco-compra-novo") - apoio - num("valor-venda-atual");
  const cred = credito(emFalta);
  // Com crédito, os juros também fazem parte do que a troca tem de pagar
  const investimento = emFalta + (cred ? cred.juros : 0);

  // Conclusão
  let veredito;
  let anos = null;

  if (poupanca <= 0) {
    veredito = {
      tipo: "mau",
      titulo: t("Não compensa"),
      texto: t("O carro novo custa mais {v} por ano a manter. Só pelos custos, a troca nunca se paga.", { v: "<strong>" + euros(-poupanca) + "</strong>" }),
    };
  } else if (investimento <= 0) {
    anos = 0;
    veredito = {
      tipo: "bom",
      titulo: t("Compensa já"),
      texto: t("A venda do teu carro cobre a compra e ainda poupas {v} por ano.", { v: "<strong>" + euros(poupanca) + "</strong>" }),
    };
  } else {
    anos = investimento / poupanca;
    veredito = {
      tipo: anos > 10 ? "medio" : "bom",
      titulo: t(anos > 10 ? "Compensa, mas demora" : "Compensa"),
      texto: t("Poupas {v} por ano.", { v: "<strong>" + euros(poupanca) + "</strong>" }) + " " +
        t("O investimento de {v}", { v: "<strong>" + euros(investimento) + "</strong>" }) +
        (cred && cred.juros > 0 ? t(" (inclui {v} de juros)", { v: euros(cred.juros) }) : "") +
        (apoio ? t(", já com o apoio de {v},", { v: euros(apoio) }) : "") +
        t(" fica pago ao fim de {n} anos.", { n: decimal(anos) }),
    };
  }

  document.getElementById("resultado").innerHTML = `
    <h2 class="resultado__titulo">${t("Tempo até a troca se pagar")}</h2>
    ${mostrador(anos, veredito.tipo)}
    <div class="veredito veredito--${veredito.tipo}">
      <h3 class="veredito__titulo">${veredito.titulo}</h3>
      <p class="veredito__texto">${veredito.texto}</p>
    </div>
    ${mensal(atual, novo, cred)}
    ${cred ? blocoCredito(cred, poupanca) : ""}
    ${tabela(atual, novo)}`;

  desenharGrafico(atual, novo, investimento, anos);

  // Barra de resumo (telemóveis)
  const resumo = document.getElementById("resumo");
  resumo.style.setProperty("--cor-veredito", "var(--" + veredito.tipo + ")");
  document.getElementById("resumo-texto").textContent =
    anos ? t("{titulo}: {n} anos", { titulo: veredito.titulo, n: decimal(anos) }) : veredito.titulo;

  // Leitores de ecrã: só anuncia quando a conclusão muda
  const anuncio = document.getElementById("anuncio");
  if (anuncio.textContent !== veredito.titulo) anuncio.textContent = veredito.titulo;
}

// Bloco do resultado com a prestação e o efeito no orçamento de cada mês
function blocoCredito(cred, poupanca) {
  const diferenca = poupanca / 12 - cred.prestacao;
  const efeito = diferenca >= 0
    ? t("ficas com mais {v} por mês", { v: "<strong>" + euros(diferenca) + "</strong>" })
    : t("gastas mais {v} por mês", { v: "<strong>" + euros(-diferenca) + "</strong>" });
  return `
    <div class="credito">
      <div class="credito__item"><span>${t("Prestação")}</span><strong>${euros(cred.prestacao)}</strong><small>${t("por mês, durante {n} meses", { n: cred.meses })}</small></div>
      <div class="credito__item"><span>${t("Juros no total")}</span><strong>${euros(cred.juros)}</strong><small>${t("sobre {v}", { v: euros(cred.financiado) })}</small></div>
      <p class="credito__nota">${t("Enquanto pagas o crédito, os custos do carro baixam {c} por mês e pagas {p} de prestação: {efeito}.", { c: euros(Math.max(0, poupanca) / 12), p: euros(cred.prestacao), efeito: efeito })}</p>
    </div>`;
}

// Mostrador semicircular, de 0 a 20 anos (como os do tablier)
function mostrador(anos, tipo) {
  const MAX = 20, cx = 120, cy = 120, r = 100;

  function ponto(v) {
    const a = Math.PI * (1 - Math.min(v, MAX) / MAX);
    return [(cx + r * Math.cos(a)).toFixed(1), (cy - r * Math.sin(a)).toFixed(1)];
  }
  function arco(de, ate) {
    const [x1, y1] = ponto(de), [x2, y2] = ponto(ate);
    return `M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2}`;
  }

  const valor = tipo === "mau" ? MAX : anos;
  const [mx, my] = ponto(valor);
  const cor = "var(--" + tipo + ")";

  let svg = `<path d="${arco(0, 10)}" fill="none" style="stroke:var(--bom)" stroke-opacity=".22" stroke-width="14" />`;
  svg += `<path d="${arco(10, MAX)}" fill="none" style="stroke:var(--medio)" stroke-opacity=".22" stroke-width="14" />`;
  if (valor > 0) svg += `<path d="${arco(0, valor)}" fill="none" style="stroke:${cor}" stroke-width="14" stroke-linecap="round" />`;
  svg += `<circle cx="${mx}" cy="${my}" r="10" style="fill:var(--superficie);stroke:${cor}" stroke-width="4" />`;

  const numero = tipo === "mau" ? "∞" : decimal(anos);
  const legenda = t(tipo === "mau" ? "nunca se paga" : "anos");

  return `
    <div class="mostrador">
      <svg viewBox="0 0 240 132" aria-hidden="true">${svg}</svg>
      <div class="mostrador__valor"><strong>${numero}</strong><span>${legenda}</span></div>
      <div class="mostrador__escala"><span>0</span><span>10</span><span>${t("20+ anos")}</span></div>
    </div>`;
}

// Quanto sai por mês em combustível/energia e, com crédito, a prestação
function mensal(atual, novo, cred) {
  const energiaAtual = atual.linhas["Energia"] / 12;
  const energiaNovo = novo.linhas["Energia"] / 12;
  const prestacao = cred ? cred.prestacao : 0;
  const linhaPrestacao = cred ? `
        <tr>
          <th scope="row">${t("Prestação")}</th>
          <td>–</td>
          <td>${euros(prestacao)}</td>
        </tr>` : "";

  return `
    <table class="comparar comparar--mensal">
      <caption>${t(cred ? "Por mês: combustível + prestação" : "Por mês: combustível")}</caption>
      <thead>
        <tr>
          <th scope="col"><span class="so-leitor">${t("Custo")}</span></th>
          <th scope="col" class="col-atual">${t("Atual")}</th>
          <th scope="col" class="col-novo">${t("Novo")}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">${t("Combustível / energia")}</th>
          <td>${euros(energiaAtual)}</td>
          <td>${euros(energiaNovo)}</td>
        </tr>${linhaPrestacao}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">${t("Total por mês")}</th>
          <td class="col-atual">${euros(energiaAtual)}</td>
          <td class="col-novo">${euros(energiaNovo + prestacao)}</td>
        </tr>
      </tfoot>
    </table>`;
}

// Tabela com os custos dos dois carros lado a lado
function tabela(atual, novo) {
  function diferenca(v) {
    const classe = v > 0.5 ? "positivo" : v < -0.5 ? "negativo" : "";
    const sinal = v > 0.5 ? "+" : v < -0.5 ? "−" : "";
    return `<td class="${classe}">${sinal}${eurosRedondos(Math.abs(v))}</td>`;
  }

  const linhas = Object.keys(atual.linhas).map(nome => `
    <tr>
      <th scope="row">${t(nome === "Energia" ? "Combustível / energia" : nome)}</th>
      <td>${eurosRedondos(atual.linhas[nome])}</td>
      <td>${eurosRedondos(novo.linhas[nome])}</td>
      ${diferenca(atual.linhas[nome] - novo.linhas[nome])}
    </tr>`).join("");

  return `
    <table class="comparar">
      <caption class="so-leitor">${t("Custos por ano de cada carro e quanto poupas")}</caption>
      <thead>
        <tr>
          <th scope="col"><span class="so-leitor">${t("Custo")}</span></th>
          <th scope="col" class="col-atual">${t("Atual")}</th>
          <th scope="col" class="col-novo">${t("Novo")}</th>
          <th scope="col" class="col-dif">${t("Poupas")}</th>
        </tr>
      </thead>
      <tbody>${linhas}</tbody>
      <tfoot>
        <tr>
          <th scope="row">${t("Total por ano")}</th>
          <td class="col-atual">${eurosRedondos(atual.total)}</td>
          <td class="col-novo">${eurosRedondos(novo.total)}</td>
          ${diferenca(atual.total - novo.total)}
        </tr>
      </tfoot>
    </table>`;
}
