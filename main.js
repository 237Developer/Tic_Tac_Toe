
import * as displayer from './displayer.js';
import {message} from './displayer.js';
import {boxes} from './displayer.js';
import * as GameController from './gameController.js';
import{players, createPlayer} from './gameController.js';



const playBtn = document.querySelector(".play-btn");

// Game space elements.
const gameSpace = document.querySelector(".game-space");
const board = document.querySelector(".board");
const passTurnButton = document.getElementById("pass-turn");
const ruleButton = document.getElementById("rules-btn");

// Form elements.
const form = document.getElementById("form");
const formDialog = document.querySelector(".form-dialog");
const validatePlayer = document.getElementById("submit-player-name");
const player1Field = document.getElementById("player-1-name-field");
const player2Field = document.getElementById("player-2-name-field");

// End-game results modal components.
const winnerAnnouncementDialog = document.querySelector(".winner-dialog");
const winnerMessage=document.querySelector(".winner-message");
const quitButton = document.querySelector(".quit-btn");
const playAgainButton = document.querySelector(".play-again-btn");

//Rule dialog modal component
const ruleDialog=document.querySelector(".rules-dialog");
const closeRuleDialog=document.querySelector(".close-rule-dialog");

playBtn.addEventListener("click", ()=>{
    formDialog.showModal();
})

validatePlayer.addEventListener("click", ()=>{
    if(player1Field.value==="" || player2Field.value===""){
    alert("You must fill in all the fields");
    }
    else if(player1Field.value===player2Field.value){
        alert("Player must have differents name.")
    }else{
        const player1=createPlayer(player1Field.value, "X");
        const player2=createPlayer(player2Field.value, "O");
        players.push(player1, player2);
        form.reset();
        formDialog.close();
        playBtn.classList.add("hide")
        gameSpace.classList.remove("hide")
        GameController.initializeGame();
        displayer.initializeUI(player1, player2);
    }

})

passTurnButton.addEventListener("click", ()=>{

    if(GameController.canPassTurn()){
        GameController.passTurn();
        const currentPlayer=GameController.getCurrentPlayer();
        message.innerText=currentPlayer.name+"'S  TURN";
    } else alert("You can't pass the turn without palying !")

})

boxes.forEach((elt)=>{
    elt.addEventListener("click", (e)=>{
        const elt=e.target; 
        const lastElt=boxes[GameController.getLastBoxId()];
        const eltId=elt.dataset.id; 

        const currentPlayer=GameController.getCurrentPlayer();

        if(GameController.canMove(eltId)){
            GameController.makeMove(eltId, currentPlayer.symbol);
            displayer.changeBoardUI(lastElt, "");
            displayer.changeBoardUI(elt, currentPlayer.symbol);
        } else{
            alert("You can't play on this box")
        }

        if(GameController.haveWinner()){
            winnerAnnouncementDialog.showModal();
            winnerMessage.innerHTML=`The Winner is: <br><br><span class="winner-name">${currentPlayer.name}</span>`;
            return; 
        }else if(GameController.isTie()){
            winnerAnnouncementDialog.showModal();
            winnerMessage.innerHTML="Tie !"
        }
  
    })
})

quitButton.addEventListener("click", ()=>{
    displayer.renitializeUI(GameController.getCurrentPlayer());
    GameController.quitGame();
    gameSpace.classList.add("hide");
    playBtn.classList.remove("hide");
    winnerAnnouncementDialog.close();
})

playAgainButton.addEventListener("click", ()=>{
    GameController.resetGame();
    displayer.renitializeUI(GameController.getCurrentPlayer());
    winnerAnnouncementDialog.close();
})

ruleButton.addEventListener("click", ()=>{
    ruleDialog.showModal();
})

closeRuleDialog.addEventListener("click", ()=>{
    ruleDialog.close();
})