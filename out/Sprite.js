import Vector2 from "./utility/Vector2.js";
export default class Sprite {
    path;
    image = new Image();
    loaded = false;
    get size() {
        return new Vector2.Immutable(this.image.width, this.image.height);
    }
    constructor(path) {
        this.path = path;
        this.image.src = `static/image/${path}.png`;
        this.image.addEventListener("load", () => this.loaded = true);
    }
    draw(context, x, y) {
        if (!this.loaded)
            return;
        context.drawImage(this.image, x - Math.floor(this.image.width / 2), Math.floor(y - this.image.height / 2));
    }
}
