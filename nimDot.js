const dotDiameter = 50 * scale;

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
            circle(this.x, this.y, dotDiameter);
        }
    }

}