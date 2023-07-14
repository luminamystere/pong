import Sprite from "./Sprite.js";
import Math2 from "./utility/Math2.js";
import Rectangle from "./utility/Rectangle.js";
import Vector2 from "./utility/Vector2.js";
export default class Brick {
    startPosition;
    static brickSprites = [
        new Sprite("brickDamage3"),
        // new Sprite("brickDamage2"),
        // new Sprite("brickDamage1"),
        new Sprite("brick"),
    ];
    brickHealth = 1;
    intersectingX = false;
    intersectingY = false;
    brickScore = 100;
    //public brickRow = 0;
    static brickSpeed = 0.01;
    //make this better later
    static get brickSize() {
        return this.brickSprites[0].size;
    }
    // accessors
    get brickSprite() {
        return Brick.brickSprites[Math2.clamp(0, Brick.brickSprites.length - 1, this.brickHealth)];
    }
    // methods
    getBrickPosition(elapsedTime) {
        return new Vector2(this.startPosition.x, this.startPosition.y + (elapsedTime * Brick.brickSpeed));
    }
    getbrickRectangle(elapsedTime) {
        return Rectangle.fromCentre(this.getBrickPosition(elapsedTime) ?? Vector2.ZERO, this.brickSprite.size);
    }
    constructor(startPosition, brickRow) {
        this.startPosition = startPosition;
    }
    // draw function
    draw(context, time) {
        if (this.getBrickPosition(time)) {
            this.brickSprite.draw(context, ...this.getBrickPosition(time).xy);
        }
    }
    // trycollide function
    tryCollide(pong) {
        if (!pong.ball.ballPos)
            return;
        const bricktangle = this.getbrickRectangle(pong.elapsedTime);
        const wasIntersectingX = this.intersectingX;
        const wasIntersectingY = this.intersectingY;
        this.intersectingX = bricktangle.intersectsX(pong.ball.ballRectangle);
        this.intersectingY = bricktangle.intersectsY(pong.ball.ballRectangle);
        if (!bricktangle.intersects(pong.ball.ballRectangle)) {
            return;
        }
        // right side collision
        if (!wasIntersectingX && pong.ball.ballRectangle.left < bricktangle.right && pong.ball.ballVelocity.x < 0) {
            pong.ball.ballPos.x = bricktangle.right + pong.ball.ballRectangle.size.x / 2 + 1;
            pong.ball.ballVelocity.x *= -1;
        }
        // left side collision
        else if (!wasIntersectingX && pong.ball.ballRectangle.right > bricktangle.left && pong.ball.ballVelocity.x > 0) {
            pong.ball.ballPos.x = bricktangle.left - pong.ball.ballRectangle.size.x / 2 - 1;
            pong.ball.ballVelocity.x *= -1;
        }
        // bottom side collision
        if (!wasIntersectingY && pong.ball.ballRectangle.top < bricktangle.bottom && pong.ball.ballVelocity.y < 0) {
            pong.ball.ballPos.y = bricktangle.bottom + pong.ball.ballRectangle.size.y / 2 + 1;
            pong.ball.ballVelocity.y *= -1;
            pong.ball.ballVelocity.y += Brick.brickSpeed;
        }
        // top side collision
        else if (!wasIntersectingY && pong.ball.ballRectangle.bottom > bricktangle.top && pong.ball.ballVelocity.y > 0) {
            pong.ball.ballPos.y = bricktangle.top - pong.ball.ballRectangle.size.y / 2 - 1;
            pong.ball.ballVelocity.y *= -1;
        }
        this.brickHealth -= 1;
        if (this.brickHealth <= -1) {
            pong.score += this.brickScore;
            this.brickScore = 0;
        }
    }
}
