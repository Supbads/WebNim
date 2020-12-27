const scale = 2;

const itemsOffsetX = 30 * scale;
const itemsOffsetY = 40 * scale;
const scaleItemsX = 40 * scale;
const scaleItemsY = 55 * scale;

class NimGame {
    constructor(nimAI, level) {
        this.nimAI = nimAI;
        nimAI.attachGame(this);
        this.versusAi = true;

        if (level && typeof(level) === 'number')
        {
            this.level = level; 
        }
        else {
            this.level = 4;
        }

        this.initFlags();
        // display text e.g. winner/losers
        // todo: flagged dots animations ?
        // todo: -> manager for game modes/pvp and ai players/buttons/custom levels and other logica
        // todo move competitors logic in a competitor object
        // todo add standard mode e.g. objective is to take the last one

        this.startGame = this.startGame.bind(this);
        this.endTurn = this.endTurn.bind(this);
        this.skipTurn = this.skipTurn.bind(this);
        this.newBoard = this.giveUp.bind(this);
        this.nextLevel = this.nextLevel.bind(this);
        this.newGame = this.newGame.bind(this);
        this.rules = this.rules.bind(this);
        this.closeHelp = this.closeHelp.bind(this);
    }

    initFlags() {
        this.playerWon = false;
        this.gameEnded = false;
        this.playerTurn = true;
        this.gameStarted = false;
        this.isFirstTurn = false;
        this.hasPoppedThisTurn = false;
        this.poppedRowThisTurn = -1;
        this.gameBoard = [];
    }

    setupGameBoard(levelNum) {
        if (levelNum) {
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
        for (let row = 0; row < rows; row++) {
            this.gameBoard[row] = [];

            let baseMin = Math.random() * (rows - 1) + 1;
            let levelScale = Math.pow(0.96, level * 2);
            let baseMax2 = 1 + row + (level / levelScale);

            let random = Math.random() * (baseMax2 - baseMin) + baseMin;
            let dotsToGenerate = random;

            for (var i = 0; i < dotsToGenerate; i++) {
                let dotX = itemsOffsetX + (i * scaleItemsX);
                let dotY = itemsOffsetY + (row * scaleItemsY);
                this.gameBoard[row].push(new NimDot(dotX, dotY));
            }
        }
    }

    getDots() {
        let result = [];

        for (var i = 0; i < this.gameBoard.length; i++) {
            result.push(this.gameBoard[i].length);
        }

        return result;
    }

    startGame() { // game manager
        this.gameStarted = true;
        this.isFirstTurn = true;
        this.hasPoppedThisTurn = false;
        this.poppedRowThisTurn = -1;
        
        this.redrawButtons();
    }

    giveUp() {
        // for pvp
    }

    endTurn() {
        this.isFirstTurn = false;
        this.hasPoppedThisTurn = false;
        this.poppedRowThisTurn = -1;

        if (this.hasTheGameEnded()) {
            this.finishGame();
            return;
        }

        if (this.playerTurn && this.versusAi) {
            this.playerTurn = false;
            
            // move to a game manager
            this.nimAI.pop();
        }

        if (!this.playerTurn && this.versusAi) {
            this.playerTurn = true;

            // todo competitors
        }

        this.redrawButtons();
    }

    hasTheGameEnded() {
        let board = this.getDots();
        for (var i = 0; i < board.length; i++) {
            if (board[i] > 0) {
                return false;
            }
        }

        return true;
    }

    finishGame() { // todo gama manager
        this.gameEnded = true;
        this.playerWon = !this.playerTurn;

        // loser is whoever turn it is in misere game mode
        console.log("game over");
        // todo: gameover screen
        if (this.playerWon) {
            console.log("player won");
        } else {
            console.log("player lost");
        }
    }

    skipTurn() {
        if (this.isFirstTurn && this.versusAi) {
            console.log("skipping");
            this.endTurn();
        }
        else { //todo cannot skip in pvp 
            // or logic to draw if both skip + each person has a skip
            console.log("cannot skip");
        }
    }

    nextLevel() {
        this.initFlags();
        if (this.level < 17) {
            this.level++;
        }
        else {
            console.log("max level is 17");
        }
        this.redrawButtons();
        this.setupGameBoard();
    }

    newGame() {
        this.initFlags();
        this.redrawButtons();
        this.setupGameBoard();
    }

    popDot(x, y) {
        if (!this.playerTurn) {
            return false;
        }
        
        let dotRadius = dotDiameter / 2;

        // the dot's Y is the center => 
        let rowIndex = this.gameBoard.findIndex(row => {
            if (row.length === 0) {
                return false;
            }
            let dot = row[0];
            return y >= (dot.y - dotRadius) && y <= (dot.y + dotRadius);
        });

        if (rowIndex === -1) {
            return;
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
            else if (dot.x < x) {
                // skip calc if x is to the right
                break;
            }
            
        }
        
        if (removedIndex !== -1) {
            if (!this.gameStarted) {
                this.startGame();
            }
            this.flagDot(rowIndex, removedIndex);
        }

        if (this.hasTheGameEnded()) {
            this.finishGame();
        }
    }

    flagDot(i, j) {
        if (this.hasPoppedThisTurn && i !== this.poppedRowThisTurn) {
            return;
        }

        if (this.gameBoard[i] && this.gameBoard[i][j]) {
            let dot = this.gameBoard[i][j];
            dot.pop();
            this.gameBoard[i].splice(j, 1);

            this.isFirstTurn = false;
            this.hasPoppedThisTurn = true;
            this.poppedRowThisTurn = i;

            this.redrawButtons();
        }
    }

    draw() {        
        for (var i = 0; i < this.gameBoard.length; i++) {
            for (var j = 0; j < this.gameBoard[i].length; j++) {
                let dot = this.gameBoard[i][j];
                    dot.draw();
            }
        }
    }

    redrawButtons() { //manager
        console.log("redrawing buttons");
        removeElements();
        let currentOffset = 8;

        // 980 for help button

        if (!this.gameStarted) {
            this.startButton = this.createButton('Start', currentOffset, this.startGame);
            currentOffset = this.calculateButtonOffset(this.startButton);
        }

        if (this.gameStarted && this.isFirstTurn) {
            this.aiFirstButton = this.createButton('Skip', currentOffset, this.skipTurn);
            currentOffset = this.calculateButtonOffset(this.aiFirstButton);
        }

        this.newGameButton = this.createButton('NewGame', currentOffset, this.newGame);
        currentOffset = this.calculateButtonOffset(this.newGameButton);
        

        if (this.gameStarted && this.hasPoppedThisTurn) {
            this.endTurnButton = this.createButton('End Turn', currentOffset, this.endTurn);
            currentOffset = this.calculateButtonOffset(this.endTurnButton);
        }

        if (this.gameEnded && this.playerWon) {
            this.nextLevelButton = this.createButton('Next Level', currentOffset, this.nextLevel);
            currentOffset = this.calculateButtonOffset(this.nextLevelButton);
        }
        else if (this.gameEnded && !this.playerWon) {
            this.tryAgainButton = this.createButton('Try Again', currentOffset, this.tryAgain);
            currentOffset = this.calculateButtonOffset(this.tryAgainButton);
        }

        this.rulesButton = this.createButton('Rules', currentOffset, this.rules);
        currentOffset = this.calculateButtonOffset(this.rulesButton);
    }

    rules() {
        let modal = select('.rules-modal');
        modal.style('display', 'block');

        let closeRulesBtn = select('.close');
        closeRulesBtn.mouseClicked(this.closeHelp)
    }

    closeHelp() {
        let modal = select('.rules-modal');
        modal.style('display', 'none');
    }
    
    createButton(name, offset, func) {
        const buttonsXSize = 80 * scale;
        const buttonsYSize = 21 * scale;
        const buttonsY = 120;

        const btn = createButton(name);
        btn.position(offset, buttonsY);
        btn.mouseClicked(func);
        btn.size(buttonsXSize, buttonsYSize);

        return btn;
    }

    calculateButtonOffset(btn) {
        const buttonsSpacing = 5;

        return btn.x + btn.width + buttonsSpacing;
    }
}