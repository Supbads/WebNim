let canvasX = 1200 * (scale /1.5);
let canvasY = 400 * scale;

function setup() {
    createCanvas(canvasX, canvasY);

    this.nimAi = new NimAI();
    this.game = new NimGame(nimAi);
    this.game.setupGameBoard();
    this.game.redrawButtons();
}

function draw() {
    drawBackground();
    this.game.draw();

}

function drawBackground() {
    clear();
    background(200);

}

function mouseClicked() {
    if (mouseX >= 0 && mouseX < canvasX &&
        mouseY >= 0 && mouseY < canvasY) {
        this.game.popDot(mouseX, mouseY);
    }
}

// todo: hover for players