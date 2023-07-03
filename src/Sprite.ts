import Vector2 from "./utility/Vector2.js";

export default class Sprite {

    public readonly image = new Image();
    public loaded = false;

    public get size () {
        return new Vector2.Immutable(this.image.width, this.image.height);
    }


    public constructor (public readonly path: string) {
        this.image.src = `static/image/${path}.png`;
        this.image.addEventListener("load", () => this.loaded = true);
    }

    public draw (context: CanvasRenderingContext2D, x: number, y: number) {
        if (!this.loaded)
            return;

        context.drawImage(this.image, x - Math.floor(this.image.width / 2), Math.floor(y - this.image.height / 2));
    }
}