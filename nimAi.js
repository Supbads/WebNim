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
            //this.caseAllSingleRowsExceptOne(board);
            this.caseSingleDotsRow(board);
        }
        else if (this.onlySingleRowsLeft(board)) { // check if board has only 1s left -> take any
            this.takeOneDotFromFirstAvailableRow(board)
        }
        else if (this.allSingleRowsExceptOne(board)) {
            this.caseAllSingleRowsExceptOne(board);
        } 
        else {
            this.standardSituation(board);
        }

        this.nimGame.endTurn();
    }

    standardSituation(board) {
        let xorRes = 0;
        let largestRow = 0;
        let largestRowIndex = -1;
        for (let i = 0; i < board.length; i++) {
            let currentRow = board[i];
            xorRes = xorRes ^ currentRow;
            
            if (largestRow < currentRow) {
                largestRow = currentRow;
                largestRowIndex = i;
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

            board = this.nimGame.getDots();
            if (this.onlySingleRowsLeft(board)) {
                this.optionalOnlySingleRowsLeft(board, targetRow);
            }

        }
        else { // losing position -> pop few dots from largest row
            let maxDotsToPop = Math.min(largestRow, 4);
            let dotsToPop = Math.random() * (maxDotsToPop - 1) + 1;

            for (var i = largestRow - 1; dotsToPop > 0; i--) {
                this.nimGame.flagDot(largestRowIndex, i);
                dotsToPop--;
            }
        }
    }

    isSingleDotsRow(board) {
        return this.countRowsWithDots(board) === 1;
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
                this.nimGame.flagDot(rowIndex, i);
            }
        } else { // losing -> remove the last one
            this.nimGame.flagDot(rowIndex, 0);
        }
    }

    onlySingleRowsLeft(board) {
        for (let i = 0; i < board.length; i++) {
            if (board[i] > 1) {
                return false;
            }
        }

        return true;
    }

    optionalOnlySingleRowsLeft(board, currentRow) {
        let rows = board.length;

        if (rows % 2 === 0) { // take only if rows are even count
            this.takeOneDotFromCurrentRow(currentRow);
        }
    }

    takeOneDotFromFirstAvailableRow(board) {
        for (var i = 0; i < board.length; i++) {
            if (board[i] > 0) {
                this.nimGame.flagDot(i, 0);
            }
        }
    }

    takeOneDotFromCurrentRow(currentRow, col) {        
        if (col) {
            this.nimGame.flagDot(currentRow, col);
        } else {
            this.nimGame.flagDot(currentRow, 0);
        }
    }

    allSingleRowsExceptOne(board) {
        let rowsWithDots = this.countRowsWithDots(board);

        let singleRows = this.countSingleRows(board);
        return rowsWithDots - singleRows == 1;
    }

    caseAllSingleRowsExceptOne(board) {
        // logic is quite similar to caseSingleDotsRow except for optionality in single dot case
        let allRows = this.countRowsWithDots(board);
        
        let largestRow = -1;
        let largestRowIndex = -1;
        for (var i = 0; i < board.length; i++) {
            if (largestRow < board[i]) {
                largestRow = board[i];
                largestRowIndex = i;
            }
        }

        if (allRows % 2 === 0) { //take all from largest row or random row
            for (var i = 0; i < largestRow; i++) {
                this.takeOneDotFromCurrentRow(largestRowIndex);
            }
        }
        else { //leave 1
            for (var i = largestRow; i >= 1; i--) {
                this.takeOneDotFromCurrentRow(largestRowIndex, i);
            }
        }
    }

    countSingleRows(board) {
        let singles = 0;
        for (let i = 0; i < board.length; i++) {
            if (board[i] == 1) {
                singles++;
            }
        }

        return singles;
    }

    countRowsWithDots(board) {
        let rowsWithDots = 0;

        for (var i = 0; i < board.length; i++) {
            if (board[i] > 0)
                rowsWithDots++;
        }

        return rowsWithDots;
    }
}