// ================= CARROS NO SITE PÚBLICO (dados europeus da EEA) =================
// Dados oficiais dos carros novos registados na UE, publicados pela Agência Europeia do Ambiente
// (licença CC BY 4.0). Estão guardados no projeto, em dados/carros/ (um ficheiro por marca),
// por isso o site não faz pedidos a mais ninguém.

import { t, lingua } from "./idiomas.js";
import { calcular } from "./resultado.js";
import { preencher, atualizarUnidades } from "./carros.js";

const PASTA = "dados/carros/";
const NOMES_COMBUSTIVEL = { gasoline: "Gasolina", diesel: "Gasóleo", hybrid: "Híbrido plug-in", electric: "Elétrico" };

async function ler(ficheiro) {
  try {
    const resposta = await fetch(PASTA + ficheiro);
    if (!resposta.ok) throw new Error("HTTP " + resposta.status);
    return await resposta.json();
  } catch (erro) {
    console.error("Erro ao ler os dados dos carros:", erro);
    return null;
  }
}

// [combustível, cc, kW, consumo, teste] → "1.3 L, 75 cv, Gasolina"
function rotuloVersao(v) {
  const [combustivel, cc, kw] = v;
  const cv = Math.round(kw * 1.36);
  const motor = cc ? (cc / 1000).toLocaleString(lingua === "en" ? "en-IE" : "pt-PT", { minimumFractionDigits: 1 }) + " L, " : "";
  return motor + cv + " cv (" + kw + " kW), " + t(NOMES_COMBUSTIVEL[combustivel]);
}

function ligar(carro, marcas) {
  const marca = document.getElementById("marca-" + carro);
  const modelo = document.getElementById("modelo-" + carro);
  const ano = document.getElementById("ano-" + carro);
  const versao = document.getElementById("motor-" + carro);
  const dica = document.getElementById("dica-consumo-" + carro);
  let dados = null; // ficheiro da marca escolhida
  let ultimoPedido = 0;

  // O combustível vem com a versão, por isso esta lista não é precisa
  document.getElementById("combustivel-" + carro).closest("label").hidden = true;
  const rotulo = versao.closest("label").firstChild;
  rotulo.nodeValue = t("Versão");

  // marcas é null se o ficheiro não carregou (a lista diz "Não foi possível carregar")
  preencher(marca, (marcas || []).map(m => m.ficheiro), "Escolhe a marca", marcas, f => marcas.find(m => m.ficheiro === f).nome);
  preencher(modelo, [], "Escolhe a marca primeiro");
  preencher(ano, [], "Escolhe o modelo primeiro");
  preencher(versao, [], "Escolhe o ano primeiro");

  function versoes() {
    return dados && modelo.value && ano.value ? dados.modelos[modelo.value][ano.value] : [];
  }

  marca.addEventListener("change", async function () {
    const pedido = ++ultimoPedido;
    dica.textContent = "";
    dados = null;
    preencher(ano, [], "Escolhe o modelo primeiro");
    preencher(versao, [], "Escolhe o ano primeiro");
    if (!marca.value) {
      preencher(modelo, [], "Escolhe a marca primeiro");
      return;
    }
    preencher(modelo, [], "A carregar…");
    const lido = await ler(marca.value);
    if (pedido !== ultimoPedido) return;
    dados = lido;
    preencher(modelo, lido ? Object.keys(lido.modelos) : [], "Escolhe o modelo", lido);
  });

  modelo.addEventListener("change", function () {
    dica.textContent = "";
    preencher(versao, [], "Escolhe o ano primeiro");
    const anos = modelo.value ? Object.keys(dados.modelos[modelo.value]).sort((a, b) => b - a) : [];
    preencher(ano, anos, modelo.value ? "Escolhe o ano" : "Escolhe o modelo primeiro");
  });

  ano.addEventListener("change", function () {
    dica.textContent = "";
    const lista = versoes();
    preencher(versao, lista.map((_, i) => String(i)), ano.value ? "Escolhe a versão" : "Escolhe o ano primeiro",
      undefined, i => rotuloVersao(lista[i]));
    if (lista.length === 1) {
      versao.value = "0";
      escolheuVersao();
    }
  });

  // Versão escolhida → tipo de energia e consumo oficial
  function escolheuVersao() {
    const v = versoes()[versao.value];
    if (!v) return;
    const [combustivel, , , consumo, teste] = v;
    atualizarUnidades(carro, combustivel);
    document.getElementById("consumo-" + carro).value = consumo;

    // "Mazda" + "Mazda2" → "Mazda2" (sem repetir a marca)
    const repete = modelo.value.toLowerCase().startsWith(dados.marca.toLowerCase());
    const nome = (repete ? "" : dados.marca + " ") + modelo.value + " " + ano.value;
    dica.refazer = function () {
      dica.textContent = t(teste === "NEDC"
        ? "Consumo oficial na UE (teste NEDC, antigo, que costuma ficar abaixo do real) para {carro}. Ajusta se souberes o valor real."
        : "Consumo oficial na UE (teste WLTP) para {carro}. Ajusta se souberes o valor real.", { carro: nome });
    };
    dica.refazer();
    calcular();
  }
  versao.addEventListener("change", escolheuVersao);

  // Quando a língua muda: refaz o rótulo e os nomes das versões
  document.addEventListener("mudou-lingua", function () {
    rotulo.nodeValue = t("Versão");
    const lista = versoes();
    versao.querySelectorAll("option").forEach(function (o) {
      if (o.value) o.text = rotuloVersao(lista[o.value]);
    });
  });
}

export async function iniciarCarrosPublico() {
  const marcas = await ler("marcas.json");
  ["atual", "novo"].forEach(carro => ligar(carro, marcas));
}
