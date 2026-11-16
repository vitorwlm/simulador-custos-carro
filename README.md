# Compensa trocar de carro?

Simulador que compara o que gastas por ano com o teu carro e com um carro novo, e mostra em quantos anos a troca se paga.

**Ver online:** https://vitorwlm.github.io/simulador-custos-carro/

![Mostrador com o tempo até a troca se pagar](imagens/partilha.png)

## O que faz

- Compara combustível ou eletricidade, seguro, IUC, manutenção e inspeção dos dois carros.
- Mostra o tempo até a troca se pagar num mostrador, com a conclusão: compensa, compensa mas demora, ou não compensa.
- Inclui os apoios à compra de carros elétricos em Portugal (Fundo Ambiental e o apoio anunciado para famílias com tarifa social).
- Calcula a prestação, os juros e o gasto por mês se pagares a crédito.
- Gráfico interativo do custo acumulado ao longo dos anos.
- O resultado atualiza enquanto escreves.
- Português e inglês.

## Correr no teu computador

Precisa de [Node.js](https://nodejs.org) 22.9 ou mais recente. Não há nada para instalar.

```bash
npm start
```

Abre http://localhost:3000.

### Escolha de marca, modelo e motor (opcional, só no teu computador)

No teu computador, o simulador pode usar a [API Ninjas](https://api-ninjas.com) para escolher marca, modelo, ano e motor e estimar o consumo.

1. Cria uma conta grátis na API Ninjas.
2. Copia o ficheiro `.env.example` para `.env` e põe lá a tua chave.
3. Corre `npm start`.

O plano gratuito da API Ninjas só permite uso pessoal e não deixa mostrar os dados ao público. Por isso, no site publicado esta escolha não aparece: escolhes o tipo de energia e escreves o consumo.

## Estrutura

```
index.html          página
styles/             CSS por partes (base, topo, formulário, resultado, gráfico, resumo, layout)
scripts/            JavaScript em módulos
  main.js           arranque
  idiomas.js        traduções PT / EN
  formatar.js       números e euros
  calculo.js        custos, crédito e apoios
  resultado.js      conclusão, mostrador e tabelas
  grafico.js        gráfico (Chart.js)
  carros.js         marca, modelo e motor (API Ninjas, só no computador)
  vendor/           Chart.js
fontes/             letra Archivo
imagens/            ícone e imagem de partilha
server.js           servidor para correr no computador (guarda a chave da API fora do browser)
```

## Avisos

- Os valores são estimativas para orientação e não são aconselhamento financeiro.
- As regras dos apoios do Estado podem mudar. Confirma sempre no Fundo Ambiental.
- O site não usa cookies nem recolhe dados pessoais.

## Créditos de terceiros

| O quê | Autor | Licença |
|---|---|---|
| Letra [Archivo](https://github.com/Omnibus-Type/Archivo) | The Archivo Project Authors | SIL Open Font License 1.1 ([fontes/OFL.txt](fontes/OFL.txt)) |
| [Chart.js](https://www.chartjs.org) 4.4.7 | Chart.js Contributors | MIT ([scripts/vendor/LICENSE-chart.js.md](scripts/vendor/LICENSE-chart.js.md)) |
| Dados de veículos (só no computador) | [API Ninjas](https://api-ninjas.com) | Termos da API Ninjas |

## Direitos de autor

© 2026 vitorwlm. Todos os direitos reservados. Ver [LICENSE](LICENSE).

---

**English:** A simulator that compares the yearly running costs of your current car with a new one and shows how many years the switch takes to pay off, including Portuguese EV purchase support and loan payments. © 2026 vitorwlm, all rights reserved.
