// Module dedicated to updating the user interface.

const player1Name = document.getElementById("player-1-name");
const player1Symbol = document.getElementById("player-1-symbol");
const player2Name = document.getElementById("player-2-name");
const player2Symbol = document.getElementById("player-2-symbol");
const message = document.querySelector(".message");

const boxes=Array.from(document.querySelectorAll(".box"));

    const initializeUI=(player1, player2)=>{
        player1Name.innerText=player1.name+":";
        player1Symbol.innerText=player1.symbol;
        player2Name.innerText=player2.name+":";
        player2Symbol.innerText=player2.symbol;

        message.innerText=player1.name+"'S  TURN";
    }
    const renitializeUI=(currentPlayer)=>{

        boxes.forEach((box)=>{box.innerText=""});
        message.innerHTML=currentPlayer.name+"'S  TURN";
    }

    const changeBoardUI=(box, symbol)=>{
        try {
            box.innerText=symbol; 
        } catch (error) {
            return;
        }
    }

    export {initializeUI,renitializeUI, changeBoardUI, boxes, message};
