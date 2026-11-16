// ================= CARROS NO SITE PÚBLICO (fueleconomy.gov) =================
// Dados públicos do governo dos EUA (EPA e Departamento de Energia): ano, marca, modelo,
// versão e consumo oficial. Não precisa de chave e pode ser usado no site publicado.
// Só tem carros vendidos nos EUA.

import { t, lingua } from "./idiomas.js";
import { calcular } from "./resultado.js";
import { preencher, atualizarUnidades } from "./carros.js";

const BASE = "https://www.fueleconomy.gov/ws/rest/vehicle/";
const PRIMEIRO_ANO = 1984; // primeiro ano com dados

async function pedir(caminho) {
  try {
    const resposta = await fetch(BASE + caminho, { headers: { Accept: "application/json" } });
    if (!resposta.ok) throw new Error("HTTP " + resposta.status);
    return await resposta.json();
  } catch (erro) {
    console.error("Erro no fueleconomy.gov:", erro);
    return null;
  }
}

// A API devolve uma lista, ou um só objeto quando só há uma opção
function itens(dados) {
  const lista = dados && dados.menuItem;
  return !lista ? [] : Array.isArray(lista) ? lista : [lista];
}

// "Auto (AV-S10), 4 cyl, 2.0 L" → "Automática (AV-S10), 4 cil, 2.0 L" (em português)
function rotuloVersao(texto) {
  if (lingua === "en") return texto;
  return texto.replace(/^Auto\b/, "Automática").replace(/^Man\b/, "Manual")
    .replace(/variable gear ratios/i, "variação contínua").replace(/\bcyl\b/, "cil")
    .replace(/(\d+)-spd/, "$1 velocidades");
}

function ligar(carro, anos) {
  const ano = document.getElementById("ano-" + carro);
  const marca = document.getElementById("marca-" + carro);
  const modelo = document.getElementById("modelo-" + carro);
  const versao = document.getElementById("motor-" + carro);
  const dica = document.getElementById("dica-consumo-" + carro);
  let textos = {}; // id da versão → texto da API
  let ultimoPedido = 0;

  // Aqui o ano vem primeiro e não há lista de combustível (vem com a versão)
  document.getElementById("combustivel-" + carro).closest("label").hidden = true;
  ano.closest("label").style.order = -1;
  const rotulo = versao.closest("label").firstChild;
  rotulo.nodeValue = t("Versão");

  preencher(ano, anos, "Escolhe o ano");
  preencher(marca, [], "Escolhe o ano primeiro");
  preencher(modelo, [], "Escolhe a marca primeiro");
  preencher(versao, [], "Escolhe o modelo primeiro");

  function encherVersoes(dados) {
    const lista = itens(dados);
    textos = Object.fromEntries(lista.map(v => [v.value, v.text]));
    preencher(versao, lista.map(v => v.value), "Escolhe a versão", dados, id => rotuloVersao(textos[id]));
    if (lista.length === 1) {
      versao.value = lista[0].value;
      escolheuVersao();
    }
  }

  // Versão escolhida → tipo de energia e consumo oficial
  async function escolheuVersao() {
    const pedido = ++ultimoPedido;
    if (!versao.value) return;
    dica.textContent = t("A carregar…");
    const d = await pedir(encodeURIComponent(versao.value));
    if (pedido !== ultimoPedido) return;
    if (!d) {
      dica.textContent = t("Não foi possível carregar");
      return;
    }

    const eletrico = d.atvType === "EV" || /electricity/i.test(d.fuelType1);
    const combustivel = eletrico ? "electric" : /diesel/i.test(d.fuelType1) ? "diesel"
      : /hybrid/i.test(d.atvType) ? "hybrid" : "gasoline";
    atualizarUnidades(carro, combustivel);

    // EPA: milhas por galão (combustão) ou kWh por 100 milhas (elétricos) → valores europeus
    const consumo = eletrico ? Number(d.combE) / 1.609344 : 235.215 / Number(d.comb08);
    if (isFinite(consumo) && consumo > 0) {
      document.getElementById("consumo-" + carro).value = Math.round(consumo * 10) / 10;
    }

    dica.refazer = function () {
      dica.textContent = t("Consumo oficial EPA (EUA) para {carro}. Ajusta se souberes o valor real.",
        { carro: d.make + " " + d.model + " " + d.year });
    };
    dica.refazer();
    calcular();
  }

  ano.addEventListener("change", async function () {
    const pedido = ++ultimoPedido;
    dica.textContent = "";
    preencher(modelo, [], "Escolhe a marca primeiro");
    preencher(versao, [], "Escolhe o modelo primeiro");
    if (!ano.value) {
      preencher(marca, [], "Escolhe o ano primeiro");
      return;
    }
    preencher(marca, [], "A carregar…");
    const dados = await pedir("menu/make?year=" + ano.value);
    if (pedido !== ultimoPedido) return;
    preencher(marca, itens(dados).map(i => i.value), "Escolhe a marca", dados);
  });

  marca.addEventListener("change", async function () {
    const pedido = ++ultimoPedido;
    dica.textContent = "";
    preencher(versao, [], "Escolhe o modelo primeiro");
    if (!marca.value) {
      preencher(modelo, [], "Escolhe a marca primeiro");
      return;
    }
    preencher(modelo, [], "A carregar…");
    const dados = await pedir("menu/model?year=" + ano.value + "&make=" + encodeURIComponent(marca.value));
    if (pedido !== ultimoPedido) return;
    preencher(modelo, itens(dados).map(i => i.value), "Escolhe o modelo", dados);
  });

  modelo.addEventListener("change", async function () {
    const pedido = ++ultimoPedido;
    dica.textContent = "";
    if (!modelo.value) {
      preencher(versao, [], "Escolhe o modelo primeiro");
      return;
    }
    preencher(versao, [], "A carregar…");
    const dados = await pedir("menu/options?year=" + ano.value + "&make=" + encodeURIComponent(marca.value) +
      "&model=" + encodeURIComponent(modelo.value));
    if (pedido !== ultimoPedido) return;
    encherVersoes(dados);
  });

  versao.addEventListener("change", escolheuVersao);

  // Quando a língua muda: refaz o rótulo e os nomes das versões
  document.addEventListener("mudou-lingua", function () {
    rotulo.nodeValue = t("Versão");
    versao.querySelectorAll("option").forEach(function (o) {
      if (o.value) o.text = rotuloVersao(textos[o.value]);
    });
  });
}

export function iniciarCarrosPublico() {
  const anos = [];
  for (let a = new Date().getFullYear() + 1; a >= PRIMEIRO_ANO; a--) anos.push(String(a));
  ["atual", "novo"].forEach(carro => ligar(carro, anos));
}
