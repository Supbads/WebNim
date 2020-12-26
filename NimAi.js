const delayTimeMs = 200;

class NimAI {
    constructor() {
    }

    attachGame(nimGame) {
        this.nimGame = nimGame;
    }

    pop() {
        let board = this.nimGame.getDots();
        
        if (this.isSingleDotsRow(board)) {
            this.caseSingleDotsRow(board);
        }
        else if (this.areSingleDotRowsLeft(board)) { // check if board has only 1s left -> take any
            

            for (var i = 0; i < board.length; i++) {
                if (board[i] > 0) {
                    this.nimGame.flagDot(i, 0);
                }
            }
        }
        else {
            this.standardSituation(board);
        }

        this.nimGame.endTurn();
    }

    isSingleDotsRow(board) {
        let rowsWithData = 0;

        for (var i = 0; i < board.length; i++) {
            if (board[i] > 0)
                rowsWithData++;
        }

        return rowsWithData === 1;
    }

    caseSingleDotsRow(board) {
        let rowIndex = -1;
        let rowDots = -1; 

        for (let i = 0; i < board.length; i++) {
            if (board[i] > 0) {
                rowIndex = i;
                rowDots = board[i];
                break;
            }
        }

        if (rowDots > 1) { // winning -> remove all but 1
            for (let i = rowDots - 1; i > 0; i--) {
                this.nimGame.flagDot(rowIndex, i); //todo find a way to make this non instant
            }
        } else { // losing -> remove the last one
            this.nimGame.flagDot(rowIndex, 0);
        }
    }
    
    areSingleDotRowsLeft(board) {
        for (let i = 0; i < board.length; i++) {
            if (board[i] > 1) {
                return false;
            }

        }

        return true;
    }

    standardSituation(board) {
        let xorRes = 0;
        let maxRowDots = 0;
        let maxIdx = -1;
        for (let i = 0; i < board.length; i++) {
            let currentRow = board[i];
            xorRes = xorRes ^ currentRow;
            
            if (maxRowDots < currentRow) {
                maxRowDots = currentRow;
                maxIdx = i;
            }
        }

        if (xorRes !== 0) { // winning position
            let xorRows = board.map(r => r ^ xorRes);
            let targetRow = -1;
            let dotsToPop = -1;

            for (let i = 0; i < xorRows.length; i++) {
                let xorRow = xorRows[i];
                let rowDots = board[i];
                if (xorRow < rowDots) {
                    dotsToPop = rowDots - xorRow;
                    targetRow = i;
                    break;
                }
            }

            for (let i = board[targetRow] - 1; dotsToPop > 0; i--) {
                this.nimGame.flagDot(targetRow, i);
                dotsToPop--;
            }
        }
        else { // losing position
            let maxDotsToPop = Math.min(maxRowDots, 4);
            let dotsToPop = Math.random() * (maxDotsToPop - 1) + 1;

            for (var i = maxRowDots - 1; dotsToPop > 0; i--) {
                this.nimGame.flagDot(maxIdx, i);
                dotsToPop--;
            }
        }
    }
}