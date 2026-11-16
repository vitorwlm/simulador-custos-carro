// ================= CARROS (API Ninjas) =================
// Plano gratuito: marca, modelo, ano, combustível, versões do motor, cilindrada e classe.

import { decimal } from "./formatar.js";
import { calcular } from "./resultado.js";
import { t } from "./idiomas.js";

// Pede listas à API Ninjas através do server.js
async function facetas(parametros) {
  try {
    const resposta = await fetch("/ninjas/carfacets?" + parametros);
    if (!resposta.ok) throw new Error("HTTP " + resposta.status);
    return await resposta.json();
  } catch (erro) {
    console.error("Erro na API Ninjas:", erro);
    return null;
  }
}

// Tira os valores de uma faceta: [{value, count}] → ["valor", ...]
function lista(dados, faceta) {
  return ((dados && dados[faceta]) || []).map(f => String(f.value));
}

// Nomes dos combustíveis em português (a API devolve-os em inglês)
const COMBUSTIVEIS = {
  gas: "Gasolina", gasoline: "Gasolina", petrol: "Gasolina", diesel: "Gasóleo",
  electricity: "Elétrico", electric: "Elétrico", hybrid: "Híbrido",
};

// Enche um <select> com uma lista de nomes (sem nomes, fica desativado)
// Se "dados" vier a null, a API falhou e o texto avisa disso
export function preencher(select, nomes, textoInicial, dados, rotulo) {
  if (dados === null) textoInicial = "Não foi possível carregar";
  else if (dados && nomes.length === 0) textoInicial = "Sem resultados";
  textoInicial = t(textoInicial);
  select.innerHTML = "";
  select.disabled = nomes.length === 0;
  select.add(new Option(textoInicial, ""));
  nomes.forEach(function (nome) {
    select.add(new Option(rotulo ? rotulo(nome) : t(COMBUSTIVEIS[nome.toLowerCase()] || nome), nome));
  });
}

// Combustível escolhido é elétrico? (a API usa "electric" ou "electricity")
function eElectrico(combustivel) {
  return /electric/i.test(combustivel) && !/hybrid/i.test(combustivel);
}

// Muda unidades e etiqueta conforme o combustível.
// Os valores de exemplo só mudam quando o tipo de energia muda, para não apagar o que a pessoa escreveu.
export function atualizarUnidades(carro, combustivel) {
  const eletrico = eElectrico(combustivel);
  const tipo = document.getElementById("tipo-" + carro);
  const mudouTipo = (tipo.dataset.energia === "eletrico") !== eletrico;

  document.getElementById("unidade-consumo-" + carro).textContent = eletrico ? "kWh/100 km" : "L/100 km";
  document.getElementById("unidade-preco-" + carro).textContent = eletrico ? "€/kWh" : "€/L";

  if (mudouTipo) {
    document.getElementById("consumo-" + carro).value = eletrico ? 16 : 6.5;
    document.getElementById("preco-energia-" + carro).value = eletrico ? 0.20 : 1.70;
  }

  tipo.textContent = t(eletrico ? "Elétrico" : "Combustão");
  // Mantém a escolha manual do tipo de energia igual ao carro escolhido
  document.getElementById("energia-" + carro).value = eletrico ? "electric"
    : /diesel/i.test(combustivel) ? "diesel" : /hybrid/i.test(combustivel) ? "hybrid" : "gasoline";
  document.getElementById("titulo-energia-" + carro).textContent = t(eletrico ? "Eletricidade" : "Combustível");
  document.getElementById("rotulo-preco-" + carro).textContent = t(eletrico ? "Preço da eletricidade" : "Preço do combustível");
  tipo.dataset.energia = eletrico ? "eletrico" : "combustao";

  calcular();
}

// Lê a versão do motor: "1.5 TSI" → 1.5 litros; "190 kW four-wheel drive" → 190 kW
function lerMotor(motor) {
  const litros = (motor || "").match(/\b(\d\.\d{1,2})\b/);
  const kw = (motor || "").match(/(\d+)\s*kW/i);
  return { litros: litros ? Number(litros[1]) : null, kw: kw ? Number(kw[1]) : null };
}

// Texto da opção: cilindrada em cc e, quando a API dá kW, a potência em cv
export function rotuloMotor(motor) {
  const { litros, kw } = lerMotor(motor);
  let texto = motor.replace(/\(\s*\.?C?\s*\)/g, "").replace(/[()]/g, "")
    .replace(/four-wheel drive/i, "4x4").replace(/\s+/g, " ").trim();
  if (litros) texto += " (≈" + Math.round(litros * 1000) + " cc)";
  if (kw) texto += " (" + Math.round(kw * 1.36) + " cv)";
  return texto;
}

// Estimativa de consumo a partir do que o plano gratuito dá: cilindrada e classe do carro.
// (O consumo real da API Ninjas é só para assinantes premium.)
function estimarConsumo(combustivel, dados) {
  const classe = (dados.class || "").toLowerCase();
  const grande = /sport utility|pickup|van/.test(classe);

  if (eElectrico(combustivel)) {
    let kwh = 15; // pequenos e compactos
    if (/pickup|van/.test(classe)) kwh = 24;
    else if (/sport utility/.test(classe)) kwh = 19;
    else if (/large/.test(classe)) kwh = 18;
    else if (/midsize/.test(classe)) kwh = 16;
    // Mais potência, um pouco mais de consumo (+1 kWh por cada 100 kW acima de 150 kW)
    if (dados.kw > 150) kwh += (dados.kw - 150) / 100;
    return Math.round(kwh * 10) / 10;
  }

  const cilindrada = Number(dados.displacement);
  if (!cilindrada) return null;

  let litros = 2.3 + 2.2 * cilindrada + (grande ? 1 : 0);
  if (/diesel/i.test(combustivel)) litros *= 0.82;
  if (/hybrid/i.test(combustivel)) litros *= 0.65;
  return Math.min(16, Math.max(3.5, Math.round(litros * 10) / 10));
}

// Pede a cilindrada/classe do carro escolhido e atualiza o consumo
async function atualizarConsumo(carro, marca, modelo, ano, combustivel, motor) {
  const dica = document.getElementById("dica-consumo-" + carro);
  const tipoV1 = eElectrico(combustivel) ? "electricity" : /diesel/i.test(combustivel) ? "diesel" : "gas";
  let p = "make=" + encodeURIComponent(marca) + "&model=" + encodeURIComponent(modelo) + "&fuel_type=" + tipoV1;
  if (ano) p += "&year=" + ano;

  dica.textContent = t("A estimar o consumo…");
  let carros = null;
  try {
    const resposta = await fetch("/ninjas/v1/cars?" + p);
    if (resposta.ok) carros = await resposta.json();
  } catch (erro) {
    console.error("Erro na API Ninjas:", erro);
  }

  // Entretanto a pessoa pode ter escolhido outro carro: ignora respostas antigas
  if (document.getElementById("combustivel-" + carro).value !== combustivel ||
      document.getElementById("motor-" + carro).value !== motor) return;

  // A pesquisa da API aceita nomes parecidos (ex.: "2" devolve a pickup "B2300").
  // Só usamos o carro devolvido se o modelo for mesmo o escolhido.
  const simples = texto => String(texto || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const igual = c => [simples(modelo), simples(marca) + simples(modelo)].includes(simples(c.model)) ||
    simples(c.model).startsWith(simples(modelo)) && /^[a-z]/.test(simples(modelo));
  const encontrado = Array.isArray(carros) ? carros.find(igual) : null;

  // A cilindrada do motor escolhido vale mais do que a da API (que devolve só uma versão)
  const dadosCarro = Object.assign({}, encontrado || {});
  const lido = lerMotor(motor);
  if (lido.litros) dadosCarro.displacement = lido.litros;
  if (lido.kw) dadosCarro.kw = lido.kw;

  const valor = dadosCarro.class || dadosCarro.displacement || eElectrico(combustivel)
    ? estimarConsumo(combustivel, dadosCarro) : null;
  if (valor === null) {
    const haMotores = document.getElementById("motor-" + carro).options.length > 1;
    dica.textContent = t(haMotores
      ? "Escolhe o motor para estimar o consumo."
      : "Não há dados para estimar o consumo deste modelo. Escreve o valor que conheces.");
    return;
  }

  document.getElementById("consumo-" + carro).value = valor;
  const cilindrada = Number(dadosCarro.displacement);
  // Guarda a frase para a poder refazer se a língua mudar
  dica.refazer = function () {
    const versao = motor ? " " + rotuloMotor(motor) : cilindrada ? " " + decimal(cilindrada) + " L" : "";
    dica.textContent = t("Estimativa para {carro}. Ajusta se souberes o valor real.",
      { carro: marca + " " + modelo + versao + (ano ? t(" de {ano}", { ano: ano }) : "") });
  };
  dica.refazer();
  calcular();
}

// Liga os 4 selects de um carro: marca → modelo → ano → combustível
function ligarCarro(carro) {
  const marca = document.getElementById("marca-" + carro);
  const modelo = document.getElementById("modelo-" + carro);
  const ano = document.getElementById("ano-" + carro);
  const combustivel = document.getElementById("combustivel-" + carro);
  const motor = document.getElementById("motor-" + carro);
  const dica = document.getElementById("dica-consumo-" + carro);

  // Cada pedido tem um número; só a resposta do pedido mais recente é usada
  let ultimoPedido = 0;

  // Filtros com o que já está escolhido
  function filtros() {
    let p = "make=" + encodeURIComponent(marca.value) + "&model=" + encodeURIComponent(modelo.value);
    if (ano.value) p += "&year=" + ano.value;
    return p;
  }

  // Pede a estimativa com o que está escolhido agora
  function estimar() {
    atualizarConsumo(carro, marca.value, modelo.value, ano.value, combustivel.value, motor.value);
  }

  // Volta a pôr o motor no estado inicial
  function limparMotor(texto) {
    preencher(motor, [], texto || "Escolhe o combustível primeiro");
  }

  // Combustível escolhido → unidades, lista de motores e estimativa de consumo
  async function escolheuCombustivel() {
    const pedido = ++ultimoPedido;
    if (!combustivel.value) {
      limparMotor();
      return;
    }
    atualizarUnidades(carro, combustivel.value);
    limparMotor("A carregar…");
    let dados = await facetas("facets=badge&" + filtros() + "&fuel=" + encodeURIComponent(combustivel.value));
    // Algumas versões (ex.: elétricos) não têm combustível na API: tenta sem esse filtro
    if (dados && !lista(dados, "badge").length) dados = await facetas("facets=badge&" + filtros());
    if (pedido !== ultimoPedido) return;
    const vistos = new Set();
    const motores = lista(dados, "badge")
      .sort((a, b) => rotuloMotor(a).localeCompare(rotuloMotor(b), "pt", { numeric: true }))
      .filter(m => !vistos.has(rotuloMotor(m)) && vistos.add(rotuloMotor(m)));
    preencher(motor, motores, "Todos os motores", dados, rotuloMotor);
    if (motores.length === 1) motor.value = motores[0];
    // Sem motores na API, a lista fica desativada mas a estimativa continua
    if (!motores.length) limparMotor(dados ? "Sem versões na API" : undefined);
    estimar();
  }

  // Enche o combustível; se só houver um, escolhe-o logo
  function encherCombustivel(dados) {
    const opcoes = lista(dados, "fuel");
    preencher(combustivel, opcoes, "Escolhe o combustível", dados);
    if (opcoes.length === 1) {
      combustivel.value = opcoes[0];
      escolheuCombustivel();
    }
  }

  // 1. Marca → modelos
  marca.addEventListener("change", async function () {
    const pedido = ++ultimoPedido;
    dica.textContent = "";
    preencher(ano, [], "Escolhe o modelo primeiro");
    preencher(combustivel, [], "Escolhe o modelo primeiro");
    limparMotor();
    if (!marca.value) {
      preencher(modelo, [], "Escolhe a marca primeiro");
      return;
    }
    preencher(modelo, [], "A carregar…");
    const dados = await facetas("facets=model&make=" + encodeURIComponent(marca.value));
    if (pedido !== ultimoPedido) return;
    preencher(modelo, lista(dados, "model").sort(), "Escolhe o modelo", dados);
  });

  // 2. Modelo → anos e combustíveis
  modelo.addEventListener("change", async function () {
    const pedido = ++ultimoPedido;
    dica.textContent = "";
    limparMotor();
    if (!modelo.value) {
      preencher(ano, [], "Escolhe o modelo primeiro");
      preencher(combustivel, [], "Escolhe o modelo primeiro");
      return;
    }
    preencher(ano, [], "A carregar…");
    preencher(combustivel, [], "A carregar…");
    const dados = await facetas("facets=year,fuel&" + filtros());
    if (pedido !== ultimoPedido) return;
    preencher(ano, lista(dados, "year").sort((a, b) => b - a), "Escolhe o ano", dados);
    encherCombustivel(dados);
  });

  // 3. Ano → combustíveis desse ano
  ano.addEventListener("change", async function () {
    const pedido = ++ultimoPedido;
    dica.textContent = "";
    limparMotor();
    preencher(combustivel, [], "A carregar…");
    const dados = await facetas("facets=fuel&" + filtros());
    if (pedido !== ultimoPedido) return;
    encherCombustivel(dados);
  });

  // 4. Combustível → unidades certas, motores e consumo estimado
  combustivel.addEventListener("change", escolheuCombustivel);

  // 5. Motor → consumo estimado com a cilindrada dessa versão
  motor.addEventListener("change", estimar);
}

// As marcas são iguais nos dois carros: pede-as só uma vez
// A API Ninjas (plano gratuito) só pode ser usada para fins pessoais e os dados não podem ser
// mostrados ao público. Por isso só é usada quando o site corre no teu PC.
// No site publicado, os carros vêm do fueleconomy.gov (dados públicos), em carros-publico.js.
export const COM_API = ["localhost", "127.0.0.1"].includes(location.hostname);

export async function iniciarCarros() {
  ["atual", "novo"].forEach(function (carro) {
    document.getElementById("escolha-energia-" + carro).hidden = COM_API;
    const energia = document.getElementById("energia-" + carro);
    energia.addEventListener("change", function () {
      atualizarUnidades(carro, energia.value);
    });
  });
  document.getElementById("credito-api").hidden = !COM_API;
  document.getElementById("credito-publico").hidden = COM_API;
  if (!COM_API) return;

  const dados = await facetas("facets=make");
  const marcas = lista(dados, "make").sort();

  ["atual", "novo"].forEach(function (carro) {
    preencher(document.getElementById("marca-" + carro), marcas, "Escolhe a marca", dados);
    ligarCarro(carro);
  });
}
