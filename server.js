// Servidor simples para correr o site no teu computador (Node 22.9+, sem instalar nada).
// Arrancar com:  npm start
// 1) Mostra o site em http://localhost:3000
// 2) Faz de "ponte" para a API Ninjas, para a tua chave nunca aparecer no browser.
//    A chave fica no ficheiro .env (ver .env.example). Sem chave, o site funciona na mesma,
//    só sem a escolha de marca/modelo.

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORTA = 3000;

// Só estes tipos de ficheiro são servidos (nunca o .env, o server.js, etc.)
const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".json": "application/json",
};

// Só estes pedidos à API são aceites (os que o site usa)
const API_PERMITIDA = [
  { prefixo: "carfacets?", destino: "https://api.api-ninjas.com/v2/carfacets?" },
  { prefixo: "v1/cars?", destino: "https://api.api-ninjas.com/v1/cars?" },
];

function enviarJson(res, estado, dados) {
  res.writeHead(estado, { "Content-Type": "application/json" });
  res.end(typeof dados === "string" ? dados : JSON.stringify(dados));
}

http.createServer(async (req, res) => {
  // Pedidos à API: /ninjas/carfacets?...  e  /ninjas/v1/cars?...
  if (req.url.startsWith("/ninjas/")) {
    const pedido = req.url.slice("/ninjas/".length);
    const regra = API_PERMITIDA.find(r => pedido.startsWith(r.prefixo));
    if (!regra) return enviarJson(res, 404, { erro: "Pedido não permitido" });
    if (!process.env.API_NINJAS_KEY) return enviarJson(res, 503, { erro: "Falta a chave API_NINJAS_KEY no .env" });

    try {
      const resposta = await fetch(regra.destino + pedido.slice(regra.prefixo.length), {
        headers: { "X-Api-Key": process.env.API_NINJAS_KEY },
      });
      enviarJson(res, resposta.status, await resposta.text());
    } catch (erro) {
      enviarJson(res, 500, { erro: erro.message });
    }
    return;
  }

  // Ficheiros do site (index.html, styles/, scripts/, fontes/, imagens/)
  const ficheiro = req.url === "/" ? "index.html" : decodeURIComponent(req.url.split("?")[0].slice(1));
  const caminho = path.join(__dirname, ficheiro);
  const escondido = ficheiro.split(/[\\/]/).some(parte => parte.startsWith("."));
  const tipo = TIPOS[path.extname(caminho)];

  if (!caminho.startsWith(__dirname + path.sep) || escondido || !tipo || ficheiro === "server.js") {
    res.writeHead(404);
    res.end("Não encontrado");
    return;
  }

  fs.readFile(caminho, (erro, conteudo) => {
    if (erro) {
      res.writeHead(404);
      res.end("Não encontrado");
      return;
    }
    // no-cache: o browser confirma sempre se o ficheiro mudou (assim as alterações aparecem logo)
    res.writeHead(200, { "Content-Type": tipo, "Cache-Control": "no-cache" });
    res.end(conteudo);
  });
}).listen(PORTA, "localhost", () => console.log("Abre http://localhost:" + PORTA));
