class Vector2 {
    x;
    y;
    get xy() {
        return [this.x, this.y];
    }
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(x, y) {
        this.x += x;
        this.y += y;
        return this;
    }
    addVector(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }
    subtract(x, y) {
        this.x -= x;
        this.y -= y;
        return this;
    }
    subtractVector(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }
    copyImmutable() {
        return new Vector2.Immutable(this.x, this.y);
    }
    equals(vector) {
        return this.x === vector.x && this.y === vector.y;
    }
}
(function (Vector2) {
    class Immutable {
        x;
        y;
        static of(vector) {
            return new Immutable(vector.x, vector.y);
        }
        get xy() {
            return [this.x, this.y];
        }
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        copyMutable() {
            return new Vector2(this.x, this.y);
        }
        equals(vector) {
            return this.x === vector.x && this.y === vector.y;
        }
    }
    Vector2.Immutable = Immutable;
    Vector2.ZERO = new Immutable(0, 0);
    Vector2.ONE = new Immutable(1, 1);
    Vector2.INFINITY = new Immutable(Infinity, Infinity);
    Vector2.NEGATIVE_INFINITY = new Immutable(-Infinity, -Infinity);
})(Vector2 || (Vector2 = {}));
export default Vector2;
