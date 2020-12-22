const dotDiameter = 50;

class NimDot {
    constructor(x, y, r) {
        this.isActive = true;
        this.x = x;
        this.y = y;
    }

    pop() {
        this.isActive = false;
    }

    draw() {
        if (this.isActive) {
            fill(color(0, 0, 255));
            circle(this.x, this.y, dotDiameter);
        }

        //else {
        //    erase(220);
        //    circle(this.x, this.y, dotDiameter);
        //    noErase();

        //}
    }

}