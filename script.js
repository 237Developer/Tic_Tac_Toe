
function createPlayer(name, symbol){
    return {name, symbol}; 
}

const players = [];
const symbols = ["X", "O"];

const Board = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];
    const updateBoard = (index, symbol) => {
        if(index >= 0 && index < 9){
            board[index] = symbol;
            console.log("The board has been successfully modified."); 
        } else return;
    }
    const getBoard = () => board; 

    const resetBoard = () => {
        for(let i = 0; i < board.length; i++){
            board[i] = "";
            console.log("The board has been successfully reset.");
        }
    }
    return {getBoard, updateBoard, resetBoard};
})(); 


const boxes=Array.from(document.querySelectorAll(".box"));

// Module dedicated to updating the user interface.
const displayer = (() => {
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

    return {initializeUI,renitializeUI, changeBoardUI};
})()


const GameController = (() => {
    const board = Board.getBoard();
    //Tracks the last selected box ID to allow turn changes or rollbacks before submission.
    let lastBoxId = 9999; 
    //this is use to check if current player can pass the turn. 
    let witness=0; 
    let currentPlayerIndex = null;
    const winningCombinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];

    // The following functions define the GameController actions.

    function initializeGame(){
        currentPlayerIndex = 0; 
        console.log(`The game has been initialize. ${players[0].name}'s turn.`);
    }

    function canMove(boxId){
        if(boxId >= 0 && boxId < 9 && Board.getBoard()[boxId] === "") return true; 
        else return false; 
    }

    function haveWinner(){
        if(winningCombinations.some((combination) => combination.every((index) => board[index] === players[currentPlayerIndex].symbol))){
            return true;
        } else return false;
    }

    function isTie(){
        if(board.every((box)=>box!=="")) return true;
        else return false;
    }

    function makeMove(boxId, playerSymbol){
         Board.updateBoard(boxId, players[currentPlayerIndex].symbol);
         Board.updateBoard(lastBoxId, "");
         lastBoxId=boxId;
         witness=1;
         console.log(`${players[currentPlayerIndex].name} made a move.`);
    }

    function announceWinner(){
        if(haveWinner()){
            console.log(`The winner is ${players[currentPlayerIndex].name}`);
        } else console.log("We do not have a winner.");
    }

    function resetGame(){
        Board.resetBoard();
        lastBoxId=999;
        witness=0;
        currentPlayerIndex = 0;
        console.log(`The game restarted. ${players[currentPlayerIndex].name}'s turn.`);
    }

    function quitGame(){
        resetGame();
        console.log("You left the game.");
    }

    function canPassTurn(){
        if(witness==0) return false; 
        else return true; 
    }

    function passTurn(){
        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0; 
        lastBoxId = 999; 
        witness=0;
        console.log(`${players[currentPlayerIndex].name}'S TURN!`);
    }

    function getCurrentPlayer(){
        return players[currentPlayerIndex];
    }
    // this function will help us to reajust the box UI in case player changes their mind before passing the turn.
    function getLastBoxId(){
        return lastBoxId; 
    }

    return {canMove, makeMove, isTie, haveWinner,canPassTurn, passTurn, getCurrentPlayer, getLastBoxId, initializeGame, resetGame, quitGame}
})()


const playBtn = document.querySelector(".play-btn");

// Game space elements.
const gameSpace = document.querySelector(".game-space");
const player1Name = document.getElementById("player-1-name");
const player1Symbol = document.getElementById("player-1-symbol");
const player2Name = document.getElementById("player-2-name");
const player2Symbol = document.getElementById("player-2-symbol");
const message = document.querySelector(".message");
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

        currentPlayer=GameController.getCurrentPlayer();

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
    GameController.quitGame();
    displayer.renitializeUI(GameController.getCurrentPlayer());
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