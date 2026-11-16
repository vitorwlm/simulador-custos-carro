// ================= FORMATOS (números e euros) =================
// Seguem a língua escolhida (pt-PT ou en-IE).

import { lingua, local } from "./idiomas.js";

// Lê o número de um campo pelo id
export function num(id) {
  return Math.max(0, Number(document.getElementById(id).value) || 0);
}

// Formata um valor em euros: 1234.5 → "1234,50 €"
export function euros(valor) {
  return valor.toLocaleString(local(), { style: "currency", currency: "EUR" });
}

// Euros curtos para o gráfico: 12500 → "12,5 mil €" (em inglês: "€12.5k")
export function eurosCurtos(valor) {
  if (Math.abs(valor) >= 1000) {
    const mil = (valor / 1000).toLocaleString(local(), { maximumFractionDigits: 1 });
    return lingua === "en" ? "€" + mil + "k" : mil + " mil €";
  }
  return lingua === "en" ? "€" + Math.round(valor) : Math.round(valor) + " €";
}

// Número com uma casa decimal: 4.25 → "4,3"
export function decimal(n) {
  return n.toLocaleString(local(), { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

// Euros sem cêntimos para a tabela: 1657.5 → "1658 €"
export function eurosRedondos(valor) {
  return lingua === "en" ? "€" + Math.round(valor).toLocaleString(local()) : Math.round(valor).toLocaleString(local()) + " €";
}
