let socket;

function connectionWebSocket(){
  socket = new WebSocket(WS_URL);

  socket.addEventListener("open", handleSocketOpen);
  socket.addEventListener("message", handleSocketMessage);
  socket.addEventListener("error", handleSocketError);
  socket.addEventListener("close", handleSocketClose);
}

function handleSocketOpen(){
  console.log("socket open");
  socket.send(JSON.stringify({action: ACTIONS.ADMIN}));
}

function handleSocketMessage(event){
  const data = JSON.parse(event.data);

  if(data.action === ACTIONS.CLIENT_COUNT_UPDATE){
    updateParticipantesCount(data.count);
    console.log("participantes: " + data.count);
  }
}

function handleSocketError(err){
  console.error("socket error:", err);
}

function handleSocketClose() {
  console.log("socket closed, trying to reconnect in 5 seconds...");
  setTimeout(connectionWebSocket, 5000);
}

function updateParticipantesCount(count){
  document.getElementById("participant-counter").innerText = count;
}

function genereteCode(tam){
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < tam; i++) { // Mudança aqui: usando 'tam' em vez de 'length'
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

connectionWebSocket();

const botaoSorteio = document.getElementById("start-raffle-button");
const codeElement = document.getElementById("code"); // Renomeei para evitar conflito com a variável 'code' usada dentro da função

botaoSorteio.onclick = function(){
  const confirmationCode = genereteCode(4);
  if(socket.readyState === WebSocket.OPEN){
    socket.send(JSON.stringify({
      action: ACTIONS.READY,
      code: confirmationCode,
    }));
    displayCode(confirmationCode);
  }else {
    console.warn("Websocket não está aberto");
  }
}

function displayCode(code){
  codeElement.innerText = code; // Corrigido aqui: usando 'codeElement' para definir o texto
  botaoSorteio.innerText = "Sorteio Realizado";
}
