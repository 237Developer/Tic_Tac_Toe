
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

    export {getBoard, updateBoard, resetBoard}; 