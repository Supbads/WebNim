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

        // check if there's only one row
        // if row == 1
        if (this.singleDotsRow(board)) {
            let rowIndex = -1;
            let rowDots = -1;

            for (let i = 0; i < board.length; i++) {
                if (board[i] > 0) {
                    rowIndex = i;
                    rowDots = rowDots[i];
                }
            }

            if (rowDots > 1) { // winning -> remove all but 1
                let dotsToPop = rowDots - 1;
                
                let row = board[rowIndex];
                for (let i = row.length; dotsToPop > 0; i--) {
                    if (row[i]) {
                        nimGame.flagDot(rowIndex, i);
                        dotsToPop--;
                    }
                }
            } else { // losing -> remove the last one
                this.nimGame.flagDot(rowIndex, 1);
            }
        }

        // check if board has only 1s left -> take any

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

    singleDotsRow(board) {
        let rowsWithData = 0;

        for (var i = 0; i < board.length; i++) {
            if (board[i] > 0)
                rowsWithData++;
        }

        return rowsWithData === 1;
    }

}