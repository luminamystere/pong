import Pong from "./Pong.js";
import Sprite from "./Sprite.js";
import Rectangle from "./utility/Rectangle.js";
import Vector2 from "./utility/Vector2.js";

export default class Brick {

    //public position = new Vector2(200, 200);
    public readonly brickSprite = new Sprite("brick");
    public intersectingX = false;
    public intersectingY = false;

    // accessors
    public get brickRectangle () {
        return Rectangle.fromCentre(this.position ?? Vector2.ZERO, this.brickSprite.size);
    }

    public constructor (public readonly position: Vector2) {

    }

    // draw function
    public draw (context: CanvasRenderingContext2D) {
        if (this.position) {
            this.brickSprite.draw(context, ...this.position.xy);
        }
    }

    // trycollide function
    public tryCollide (pong: Pong) {
        if (!pong.ballPos) return;

        const wasIntersectingX = this.intersectingX;
        const wasIntersectingY = this.intersectingY;
        this.intersectingX = this.brickRectangle.intersectsX(pong.ballRectangle);
        this.intersectingY = this.brickRectangle.intersectsY(pong.ballRectangle);

        if (!this.brickRectangle.intersects(pong.ballRectangle)) {
            return;
        }
        // right side collision
        if (!wasIntersectingX && pong.ballRectangle.left < this.brickRectangle.right && pong.ballVelocity.x < 0) {
            pong.ballPos.x = this.brickRectangle.right + pong.ballRectangle.size.x / 2;
            pong.ballVelocity.x *= -1;
        }
        // left side collision
        else if (!wasIntersectingX && pong.ballRectangle.right > this.brickRectangle.left && pong.ballVelocity.x > 0) {
            pong.ballPos.x = this.brickRectangle.left - pong.ballRectangle.size.x / 2;
            pong.ballVelocity.x *= -1;
        }
        // bottom side collision
        if (!wasIntersectingY && pong.ballRectangle.top < this.brickRectangle.bottom && pong.ballVelocity.y < 0) {
            pong.ballPos.y = this.brickRectangle.bottom + pong.ballRectangle.size.y / 2;
            pong.ballVelocity.y *= -1;
        }
        // top side collision
        else if (!wasIntersectingY && pong.ballRectangle.bottom > this.brickRectangle.top && pong.ballVelocity.y > 0) {
            pong.ballPos.y = this.brickRectangle.top - pong.ballRectangle.size.y / 2;
            pong.ballVelocity.y *= -1;
        }
    }
}