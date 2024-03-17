const socket = new WebSocket(WS_URL);
const card = document.getElementById('card');
const card2 = document.getElementById('card2');
const body = document.querySelector('body');
const confimation = document.getElementById('code')
const displayInicial = document.getElementById('dp-inicial');

socket.addEventListener("message", handleServerMessage);

function handleServerMessage(event){
  const data = JSON.parse(event.data);
  console.log("Message received", data);

  switch (data.status){
    case STATUS.WIN:
      setClientState("win", data.code);
      break;
    case STATUS.LOSE:
      setClientState("lose");
      break;
  }
}

function setClientState(state, code = ""){

  const simboloWinner = document.createElement("img")
  const simboloLoser = document.createElement("img")
  //ganhador
  simboloWinner.src = "https://static.vecteezy.com/system/resources/previews/009/591/413/non_2x/check-mark-icon-free-png.png"
  simboloWinner.style.maxWidth = "190px";
  simboloWinner.style.display = "block";
  //perdedor
  simboloLoser.src = "https://www.imagensempng.com.br/wp-content/uploads/2021/08/05-24.png"
  simboloLoser.style.maxWidth = "190px";
  simboloLoser.style.transform = "scale(0.6)"
  setTimeout(() => {
    //tira o display inicial
    displayInicial.style.display = "none"
    if(state === "win"){
      card.classList.add('quadrado');
      card2.classList.add('quadrado');
      body.style.backgroundColor = "rgba(0, 255, 82, 0.1)"
      card2.appendChild(simboloWinner)
      confimation.classList.remove('hidden')
      confimation.innerText = code
    } else {
      card.classList.add('quadrado');
      card2.classList.add('quadrado');
      body.style.backgroundColor = "rgba(255, 0, 3, 0.1)"
      card2.appendChild(simboloLoser)
    }
  }, 100);
}
