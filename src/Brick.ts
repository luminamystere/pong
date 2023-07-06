import Pong from "./Pong.js";
import Sprite from "./Sprite.js";
import Math2 from "./utility/Math2.js";
import Rectangle from "./utility/Rectangle.js";
import Vector2 from "./utility/Vector2.js";

export default class Brick {

    //public position = new Vector2(200, 200);
    public readonly brickSprites = [
        new Sprite("brickDamage3"),
        new Sprite("brickDamage2"),
        new Sprite("brickDamage1"),
        new Sprite("brick"),
    ];
    public brickHealth = 3;
    public intersectingX = false;
    public intersectingY = false;
    public brickScore = 100;

    // accessors
    public get brickSprite () {
        return this.brickSprites[Math2.clamp(0, 3, this.brickHealth)];
    }
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
        if (!pong.ball.ballPos) return;

        const wasIntersectingX = this.intersectingX;
        const wasIntersectingY = this.intersectingY;
        this.intersectingX = this.brickRectangle.intersectsX(pong.ball.ballRectangle);
        this.intersectingY = this.brickRectangle.intersectsY(pong.ball.ballRectangle);

        if (!this.brickRectangle.intersects(pong.ball.ballRectangle)) {
            return;
        }
        // right side collision
        if (!wasIntersectingX && pong.ball.ballRectangle.left < this.brickRectangle.right && pong.ball.ballVelocity.x < 0) {
            pong.ball.ballPos.x = this.brickRectangle.right + pong.ball.ballRectangle.size.x / 2;
            pong.ball.ballVelocity.x *= -1;
        }
        // left side collision
        else if (!wasIntersectingX && pong.ball.ballRectangle.right > this.brickRectangle.left && pong.ball.ballVelocity.x > 0) {
            pong.ball.ballPos.x = this.brickRectangle.left - pong.ball.ballRectangle.size.x / 2;
            pong.ball.ballVelocity.x *= -1;
        }
        // bottom side collision
        if (!wasIntersectingY && pong.ball.ballRectangle.top < this.brickRectangle.bottom && pong.ball.ballVelocity.y < 0) {
            pong.ball.ballPos.y = this.brickRectangle.bottom + pong.ball.ballRectangle.size.y / 2;
            pong.ball.ballVelocity.y *= -1;
        }
        // top side collision
        else if (!wasIntersectingY && pong.ball.ballRectangle.bottom > this.brickRectangle.top && pong.ball.ballVelocity.y > 0) {
            pong.ball.ballPos.y = this.brickRectangle.top - pong.ball.ballRectangle.size.y / 2;
            pong.ball.ballVelocity.y *= -1;
        }
        this.brickHealth -= 1;

        if (this.brickHealth <= -1) {
            pong.score += this.brickScore;
            this.brickScore = 0;
        }
    }
}