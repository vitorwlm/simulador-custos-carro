// ================= ARRANQUE =================
// Liga a página: slider dos km, cálculo ao vivo, barra de resumo, línguas e carros.

import { t } from "./idiomas.js";
import { calcular } from "./resultado.js";
import { iniciarCarros, rotuloMotor, COM_API } from "./carros.js";
import { iniciarCarrosPublico } from "./carros-publico.js";

// ================= SLIDER DOS KM =================

const kmSlider = document.getElementById("km-slider");
const kmAno = document.getElementById("km-ano");

// Pinta a parte "cheia" do slider
function pintarSlider() {
  kmSlider.style.setProperty("--pct", (kmSlider.value / kmSlider.max) * 100 + "%");
}

kmSlider.addEventListener("input", function () {
  kmAno.value = kmSlider.value;
  pintarSlider();
});

kmAno.addEventListener("input", function () {
  kmSlider.value = kmAno.value;
  pintarSlider();
});

pintarSlider();

// O resultado atualiza sozinho sempre que mudas um valor
document.addEventListener("input", calcular);

// Barra de resumo: esconde-se quando o resultado está à vista (ou já passou)
new IntersectionObserver(function ([entrada]) {
  const visivel = entrada.isIntersecting || entrada.boundingClientRect.top < 0;
  document.getElementById("resumo").classList.toggle("escondido", visivel);
}).observe(document.getElementById("resultado"));

// Quando a língua muda: refaz o resultado e as notas
document.addEventListener("mudou-lingua", function () {
  ["atual", "novo"].forEach(function (carro) {
    const tipo = document.getElementById("tipo-" + carro);
    tipo.textContent = t(tipo.dataset.energia === "eletrico" ? "Elétrico" : "Combustão");
    const dica = document.getElementById("dica-consumo-" + carro);
    if (dica.refazer && dica.textContent) dica.refazer();
    // (no site público, os nomes das versões são refeitos em carros-publico.js)
    if (COM_API) {
      document.getElementById("motor-" + carro).querySelectorAll("option").forEach(function (o) {
        if (o.value) o.text = rotuloMotor(o.value);
      });
    }
  });
  calcular();
});

// Painel do resultado (computador): fica fixo enquanto se desce a página.
// Se for mais alto do que o ecrã, sobe primeiro até se ver o fim e só depois fica fixo.
const painel = document.getElementById("resultado");
function ajustarPainel() {
  const sobra = window.innerHeight - painel.offsetHeight - 20;
  painel.style.setProperty("--topo-resultado", Math.min(20, sobra) + "px");
}
new ResizeObserver(ajustarPainel).observe(painel);
window.addEventListener("resize", ajustarPainel);
document.addEventListener("input", ajustarPainel); // corre depois do calcular()

calcular();
ajustarPainel();
iniciarCarros();
if (!COM_API) iniciarCarrosPublico();
