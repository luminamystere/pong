import Vector2 from "./Vector2.js";
export default class Rectangle {
    static fromCentre(centre, size) {
        const position = new Vector2.Immutable(centre.x - Math.floor(size.x / 2), centre.y - Math.floor(size.y / 2));
        return new Rectangle(position, size);
    }
    position;
    size;
    constructor(position, size) {
        this.position = Vector2.Immutable.of(position);
        this.size = Vector2.Immutable.of(size);
    }
    get left() {
        return this.position.x;
    }
    get right() {
        return this.position.x + this.size.x;
    }
    get top() {
        return this.position.y;
    }
    get bottom() {
        return this.position.y + this.size.y;
    }
    // split this into two functions
    intersectsX(rectangle) {
        return this.position.x + this.size.x >= rectangle.position.x
            && this.position.x <= rectangle.position.x + rectangle.size.x;
    }
    intersectsY(rectangle) {
        return this.position.y + this.size.y >= rectangle.position.y
            && this.position.y <= rectangle.position.y + rectangle.size.y;
    }
    intersects(rectangle) {
        return this.intersectsX(rectangle) && this.intersectsY(rectangle);
    }
}
