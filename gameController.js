
import * as Board from './board.js';


const players = [];
const symbols = ["X", "O"];

function createPlayer(name, symbol){
    return {name, symbol}; 
}

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
    }

    function quitGame(){
        resetGame();
        //Empty the players array.
        players.length=0
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

    export {canMove, makeMove, isTie, haveWinner,canPassTurn, passTurn, getCurrentPlayer, getLastBoxId, initializeGame, resetGame, quitGame, players, createPlayer}
