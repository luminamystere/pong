import Pong from "./Pong.js";
import Sprite from "./Sprite.js";
import Rectangle from "./utility/Rectangle.js";
import Vector2 from "./utility/Vector2.js";

export default class Ball {
    public readonly ballSprite = new Sprite("ball");
    public ballPos?: Vector2;
    public ballVelocity = this.getDefaultBallVelocity();

    public get ballRectangle () {
        return Rectangle.fromCentre(this.ballPos ?? Vector2.ZERO, this.ballSprite.size);
    }
    public get ballRadius () {
        return Math.floor(this.ballSprite.image.width / 2);
    }

    private lastOnTop?: "paddle" | "ball";

    public ballPhysicsUpdate (width: number, height: number, pong: Pong) {
        this.ballVelocity.y += 0.07;
        this.ballVelocity.y *= 0.999;
        this.ballVelocity.x *= 0.995;

        this.ballPos ??= this.getDefaultBallPosition(width, height);

        this.ballPos.addVector(this.ballVelocity);

        const ballRadius = this.ballRadius;

        if (this.ballPos.x - ballRadius < 0) {
            // the ball is past the left side of the screen, reset its position back onto the screen
            this.ballPos.x = 0 + ballRadius;
            if (this.ballVelocity.x < 0) {
                this.ballVelocity.x *= -1;
            }
        }
        if (this.ballPos.x + ballRadius > width) {
            // the ball is past the right side of the screen, reset its position back onto the screen
            this.ballPos.x = width - ballRadius;
            if (this.ballVelocity.x > 0) {
                this.ballVelocity.x *= -1;
            }
        }
        this.tryPaddleCollision(pong);
        if (this.ballPos.y - ballRadius > height) {
            //ball death
            this.ballPos = this.getDefaultBallPosition(width, height);
            this.ballVelocity = this.getDefaultBallVelocity();
        }



    }

    public tryPaddleCollision (pong: Pong) {
        if (!this.ballPos) {
            return
        }
        const lastOnTop = this.lastOnTop;
        let paddleCentreY = pong.mousePosition?.y ?? 0;
        this.lastOnTop = this.ballPos.y < paddleCentreY ? "ball" : "paddle";

        //paddle intersection
        const ballRectangle = this.ballRectangle;
        const paddleRectangle = pong.paddleRectangle;
        const intersectsX = ballRectangle.position.x < pong.paddleRectangle.position.x + pong.paddleRectangle.size.x
            && ballRectangle.position.x + ballRectangle.size.x >= paddleRectangle.position.x;
        if (intersectsX) {

            const mouseVelocity = pong.mouseVelocity!;
            const mousePosition = pong.mousePosition!;
            if (lastOnTop === "paddle" && this.ballPos.y < paddleCentreY) {
                //you hit it down
                this.ballPos.y = mousePosition.y + Math.floor(pong.paddleSprite.size.y / 2) + this.ballRadius;
                if (this.ballVelocity.y < 0) {
                    this.ballVelocity.y *= -1;
                }
                this.ballVelocity.y = Math.max(this.ballVelocity.y, pong.mouseVelocity!.y * 0.5);
            } else if (lastOnTop === "ball" && this.ballPos.y > paddleCentreY || ballRectangle.intersects(paddleRectangle) && this.ballVelocity.y > mouseVelocity.y) {

                //you hit it!!
                this.ballPos.y = mousePosition.y - Math.floor(pong.paddleSprite.size.y / 2) - this.ballRadius;
                if (this.ballVelocity.y > 0) {
                    this.ballVelocity.y *= -1;

                    const diff = this.ballPos.x - mousePosition.x;
                    const paddleWidthHalf = Math.floor(pong.paddleSprite.size.x / 2);
                    const ballPositionMultiplier = Math.min(Math.abs(diff) / paddleWidthHalf, 0.8) ** 1.2;

                    const bounceVelocityX = ballPositionMultiplier * Math.sign(diff) * 3;


                    //const velocityHit = Math.min(1, Math.max(0, Math.abs(this.ballVelocity.y) / 10) - 0.3);
                    this.ballVelocity.x = this.ballVelocity.x + bounceVelocityX * (Math.abs(this.ballVelocity.y + 0.05) / 5);
                }

                this.ballVelocity.y = Math.min(this.ballVelocity.y, pong.mouseVelocity!.y * 0.3);

            }
        }


    }

    public draw (context: CanvasRenderingContext2D) {
        if (this.ballPos) {
            this.ballSprite.draw(context, ...this.ballPos.xy);
        }
    }
    private getDefaultBallPosition (width: number, height: number) {
        return new Vector2(Math.ceil(width / 2), Math.ceil(height));
    }
    private getDefaultBallVelocity () {
        return new Vector2(Math.random() * 10 - 5, -7);
    }
}