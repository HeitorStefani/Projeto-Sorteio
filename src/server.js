const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Configurações básicas
const port = process.env.PORT || 3000;
const actions = {
  ADMIN: 'admin',
  READY: 'ready',
  CLIENT_COUNT_UPDATE: 'clientCountUpdate'
};

// ROTEAMENTO DE PÁGINAS
app.use("/front", express.static("front"));
app.get("/", (req, res) => res.sendFile(__dirname + "/front/index.html"));
app.get("/admin", (req, res) => res.sendFile(__dirname + "/front/admin.html"));

server.listen(port, () => {
  console.log("O servidor ligou na porta " + port);
});

let participantes = [];

wss.on("connection", (ws) => {
  // Adiciona o participante no array
  participantes.push(ws);
  // Atualiza a lista de participantes
  updateParticipantes();
  // Caso a conexão seja fechada, a gente tira ele da lista e atualiaz os participantes
  ws.on("close", () => {
    participantes = participantes.filter((client) => client !== ws);
    updateParticipantes();
  });
  // Aqui preparamos a conexão para receber as mensagens de ações
  ws.on("message", handleIncomingMessage.bind(null, ws));
});

function handleIncomingMessage(ws, message) {
  const data = JSON.parse(message);
  const action = data.action;

  switch(action){
    case actions.ADMIN:
      ws.isAdmin = true;
      break;
    case actions.READY:
      startSorteio(data.code);
      break;
    default:
      console.log("Ação desconhecida");
  }
}

function startSorteio(confirmationCode) {
  let participantes = Array.from(wss.clients).filter((client) => !client.isAdmin);
  const vencedor = participantes[Math.floor(Math.random() * participantes.length)];

  participantes.forEach((client) => {
    let result = JSON.stringify({status: "perdeu"});
    if(client === vencedor) {
      result = JSON.stringify({status: "venceu", code: confirmationCode});
    }
    client.send(result);
  });
}

// Pegando o total de participantes com exceção do admin
function updateParticipantes(){
  const participantesCount = Array.from(wss.clients).filter((client) => !client.isAdmin).length;

  Array.from(wss.clients).forEach((client) => {
    if(client.isAdmin && client.readyState === WebSocket.OPEN){
      client.send(
        JSON.stringify({
          action: actions.CLIENT_COUNT_UPDATE,
          count: participantesCount,
        })
      );
    }
  });
}
