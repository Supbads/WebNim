const delayTimeMs = 200;

class NimAI {
    constructor() {
    }

    attachGame(nimGame) {
        this.nimGame = nimGame;
    }

    pop() {
        let board = this.nimGame.getDots();

        console.log("getDotsResult: ");
        console.log(board);


        // check if board has only 1s left

        let xorRes = 0;
        for (var i = 0; i < board.length; i++) {
            let currentRow = board[i];
            xorRes = xorRes ^ currentRow;
        }
        
        console.log("Xor: " + xorRes);

        if (xorRes !== 0) {
            // winning position

        }
        else {
            // losing position
            // take from the biggest row 1 - 3 (Math.max(row,3))


        }
        //determine if the position is winnin or losing        

    }

}