const itemsOffsetX = 30;
const itemsOffsetY = 40;
const scaleItemsX = 40;
const scaleItemsY = 55;

class NimGame {
    constructor() {
        this.playerTurn = true;
        this.gameStarted = false;
        this.isFirstRound = false;
        this.selectedRow = -1;
        this.level = 1;
        this.hasPoppedThisTurn = false;
        this.gameBoard = [];

    }
    
    setupGameBoard(levelNum) {
        if (levelNum) {st
            this.level = levelNum;
        }
        let level = this.level;
        let rows = 2;

        if (level >= 8) {
            rows = 2 + Math.floor(level / 3);
        } else {
            rows = 1 + Math.floor(level / 2);
        }

        this.gameBoard.length = 0;
        for (var row = 0; row < rows; row++) {
            this.gameBoard[row] = [];
            let baseMin = 1 + row + Math.ceil(level / 3);
            let levelScale = Math.pow(0.96, level);
            let baseMax2 = 1 + row + (level / levelScale);

            let descaleWithRows = (Math.pow(1.2, rows));
            // todo descale with rows

            let random = Math.random() * (baseMax2 - baseMin) + baseMin;
            let dotsToGenerate = random;

            for (var i = 0; i < dotsToGenerate; i++) {
                let dotX = itemsOffsetX + (i * scaleItemsX);
                let dotY = itemsOffsetY + (row * scaleItemsY);
                this.gameBoard[row].push(new NimDot(dotX, dotY));
            }
        }

        console.log('level ' + level);
        console.log('rows ' + rows);
        console.log(this.gameBoard);
        this.getDots();
    }

    getDots() {
        let result = [];

        for (var i = 0; i < this.gameBoard.length; i++) {
            result.push(this.gameBoard[i].length);
        }

        console.log("getDotsResult: ");
        console.log(result);
    }

    progress() {
        this.level++;
        this.setupGameBoard();


    }

    redrawButtons() {
        const buttonsOffset = 8;
        const buttonsSpacing = 5;
        const buttonsY = 55;
        let currentOffset = buttonsOffset;
        
        if (!this.gameStarted) {
            // todo start game also by popping a dot

            this.startButton = createButton('Start');
            this.startButton.position(8, 55);
            this.startButton.mousePressed(this.startGame);

            currentOffset = this.startButton.x + this.startButton.width + buttonsSpacing;
        }
        else if (this.gameStarted && this.isFirstRound) {
            // only when started, only the first round
            this.aiFirst = createButton('Skip');
            this.aiFirst.position(currentOffset, buttonsY);
            this.aiFirst.mousePressed(this.skipTurn);

            currentOffset = this.aiFirst.x + this.aiFirst.width + buttonsSpacing;
        }
        else if (this.gameStarted && !this.isFirstRound) {
            this.giveUp = createButton('Give up');
            this.giveUp.position(currentOffset, buttonsY);
            this.giveUp.mousePressed(this.giveUp);

            currentOffset = this.giveUp.x + this.giveUp.width + buttonsSpacing;
        }

        // has popped something
        if (this.gameStarted && this.hasPoppedThisTurn) {
            this.endTurn = createButton('End Turn');
            this.endTurn.position(currentOffset, buttonsY);
            this.endTurn.mousePressed(this.finishTurn);

            currentOffset = this.endTurn.x + this.endTurn.width + buttonsSpacing;
        }

        //these checks may be removed using a lastElement reference
    }

    startGame() {
        this.playerTurn = true;
        this.gameStarted = true;
        this.isFirstRound = true;
        this.hasPoppedThisTurn = false;
        this.selectedRow = -1;

        console.log('start');
    }

    giveUp() {
        console.log("skipaj");
    }

    finishTurn() {
        console.log("finishing turn");

    }

    popDot(x, y) {

        // itterate rows in reverse - check if the cursor is popping an object
        if (!this.playerTurn) {
            return false;
        }
        
        let dotRadius = dotDiameter / 2;

        // the dot's Y is the center => 
        let rowIndex = this.gameBoard.findIndex(row => {
            let dot = row[0];
            return y >= (dot.y - dotRadius) && y <= (dot.y + dotRadius);
        });

        if (rowIndex === -1) {
            console.log('oof');
            return false;
        }

        let correctRow = this.gameBoard[rowIndex];
        let removedIndex = -1;
        for (var i = correctRow.length - 1; i >= 0; i--) {
            let dot = correctRow[i];
            let dotX = dot.x;
            let dotY = dot.y;

            let d = Math.pow(dotRadius, 2) - (Math.pow((dotX - x), 2) + Math.pow((dotY - y), 2));

            if (d > 0) {
                removedIndex = i;
                break;
            }
            // check if x is to the right  -> to skip calc
        }
        
        if (removedIndex !== -1) {
            if (!this.gameStarted) {
                this.startGame();
            }
            this.flagDot(rowIndex, removedIndex);
            return true;
        }

        return false;
    }

    flagDot(i, j) {
        if (this.gameBoard[i] && this.gameBoard[i][j]) {
            let dot = this.gameBoard[i][j];
            console.log('poppingDot:');
            console.log(dot);
            dot.pop();

            this.hasPoppedThisTurn = true;
            // todo add to cleanup
        }
    }

    skipTurn() {
        if (this.isFirstRound) {
            console.log("skipaj");
        }
        else {
            console.log("noSkipaj");
        }
    }

    draw() {
        redraw();
        this.redrawButtons(); // shouldn't be here rly
        
        for (var i = 0; i < this.gameBoard.length; i++) {
            for (var j = 0; j < this.gameBoard[i].length; j++) {
                let dot = this.gameBoard[i][j];
                    dot.draw();
            }
        }

        // clean up inactive dots
        //this.gameBoard[rowIndex].splice(removedIndex, 1);
    }
}