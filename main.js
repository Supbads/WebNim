let canvasX = 800;
let canvasY = 400;

function setup() {
    createCanvas(800, 400);

    this.nimAi = new NimAI();
    this.game = new NimGame(nimAi);
    this.game.setupGameBoard();
    this.game.redrawButtons();

    for (var i = 1; i < 20; i++) {
        let asd = 5; // test level generations
    }
}

function draw() {
    drawBackground();
    this.game.draw();

}

function mouseClicked() {
    console.log("X: " + mouseX);
    console.log("Y: " + mouseY);

    if (mouseX >= 0 && mouseX < canvasX && mouseY >= 0 && mouseY < canvasY) {
        let popped = this.game.popDot(mouseX, mouseY);
        if (popped) {
            this.game.redrawButtons();
        }
    }
}

function drawBackground() {
    clear();
    background(220);
}
