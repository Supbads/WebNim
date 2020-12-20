


function setup() {
    createCanvas(800, 400);
    drawBackground();

    this.game = new NimGame();
    this.game.setupGameBoard();

    for (var i = 1; i < 20; i++) {
        let asd = 5;
    }


}

function draw() {
    this.game.draw();
    // write some text
    // e.g. menu

    // you start or ai starts
    // check ai vs ai option ?

    // most of the game will go to setup


    // get mouse clicks - check if dot is clicked
    // add hover for nim dots


}


function mouseClicked() {
    console.log("X: " + mouseX);
    console.log("Y: " + mouseY);

    let success = this.game.popDot(mouseX, mouseY);
    if (success) {
        drawBackground();
    }
}

function drawBackground() {
    clear();
    background(220);
}