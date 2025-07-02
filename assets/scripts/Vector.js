class Vector {
    x;
    y;
    constructor(arr) {
        this.x = arr[0];
        this.y = arr[1];
    }
    add(vec2) {
        this.x += vec2.x;
        this.y += vec2.y;
    }
    diff(vec2) {
        this.x -= vec2.x;
        this.y -= vec2.y;
    }
    smult(scalar) {
        return new Vector([this.x*scalar, this.y*scalar]);
    }
    distance(vec2) {
        return Math.sqrt(Math.pow(this.x - vec2.x, 2) + Math.pow(this.y - vec2.y, 2));
    }
}

export {Vector};