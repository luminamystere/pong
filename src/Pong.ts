import Brick from "./Brick.js";
import HUD from "./HUD.js";
import Sprite from "./Sprite.js";
import Rectangle from "./utility/Rectangle.js";
import Vector2 from "./utility/Vector2.js";

export default class Pong {


    public lastMousePosition?: Vector2.Immutable;
    public mousePosition?: Vector2.Immutable;
    public mouseVelocity?: Vector2.Immutable;
    public keyboard: Record<string, number> = {};

    public constructor () {
        window.addEventListener("mousemove", event => {
            this.mousePosition = new Vector2.Immutable(Math.ceil(event.clientX / 2), Math.ceil(event.clientY / 2))
        });

        window.addEventListener("keydown", event =>
            this.keyboard[event.key] = Date.now());
        window.addEventListener("keyup", event =>
            delete this.keyboard[event.key]);

        document.addEventListener("visibilitychange", () => this.keyboard = {});
    }

    public ballSprite = new Sprite("ball");
    public paddleSprite = new Sprite("paddle");

    public paddlePos = new Vector2(0, 0);
    public ballPos?: Vector2;
    public ballVelocity = this.getDefaultBallVelocity();

    public bricks = [
        new Brick(new Vector2(200, 200)),
        new Brick(new Vector2(300, 200)),
        new Brick(new Vector2(400, 200)),
        new Brick(new Vector2(500, 200)),
    ];

    public get ballRectangle () {
        return Rectangle.fromCentre(this.ballPos ?? Vector2.ZERO, this.ballSprite.size);
    }

    public get paddleRectangle () {
        return Rectangle.fromCentre(this.mousePosition ?? Vector2.ZERO, this.paddleSprite.size);
    }

    private lastOnTop?: "paddle" | "ball";

    //score
    public score = 0;
    public hud = new HUD();

    public render (context: CanvasRenderingContext2D, width: number, height: number) {

        this.mouseVelocity = this.mousePosition?.copyMutable()
            .subtractVector(this.lastMousePosition ?? this.mousePosition)
            .copyImmutable();
        this.lastMousePosition = this.mousePosition;

        this.ballVelocity.y += 0.07;
        this.ballVelocity.y *= 0.999;
        this.ballVelocity.x *= 0.995;

        this.ballPos ??= this.getDefaultBallPosition(width, height);

        this.ballPos.addVector(this.ballVelocity);

        const ballWidth = this.ballSprite.image.width;
        const ballRadius = Math.floor(ballWidth / 2);
        if (this.ballPos.x - ballRadius < 0) {
            // the ball is past the left side of the screen, reset its position back onto the screen
            this.ballPos.x = 0 + ballRadius;
            if (this.ballVelocity.x < 0) {
                //bounce!!
                this.ballVelocity.x *= -1;
            }
        }
        if (this.ballPos.x + ballRadius > width) {
            // the ball is past the right side of the screen, reset its position back onto the screen
            this.ballPos.x = width - ballRadius;
            if (this.ballVelocity.x > 0) {
                //ball is moving towards edge of screen, so invert x velocity to make bounce
                this.ballVelocity.x *= -1;
            }
        }



        const lastOnTop = this.lastOnTop;
        let paddleCentreY = this.mousePosition?.y ?? 0;
        this.lastOnTop = this.ballPos.y < paddleCentreY ? "ball" : "paddle";

        //paddle intersection
        const ballRectangle = this.ballRectangle;
        const paddleRectangle = this.paddleRectangle;
        const intersectsX = ballRectangle.position.x < this.paddleRectangle.position.x + this.paddleRectangle.size.x
            && ballRectangle.position.x + ballRectangle.size.x >= paddleRectangle.position.x;
        if (intersectsX) {

            const mouseVelocity = this.mouseVelocity!;
            const mousePosition = this.mousePosition!;
            if (lastOnTop === "paddle" && this.ballPos.y < paddleCentreY) {
                //you hit it down
                this.ballPos.y = mousePosition.y + Math.floor(this.paddleSprite.size.y / 2) + ballRadius;
                if (this.ballVelocity.y < 0) {
                    this.ballVelocity.y *= -1;
                }
                this.ballVelocity.y = Math.max(this.ballVelocity.y, this.mouseVelocity!.y * 0.5);
            } else if (lastOnTop === "ball" && this.ballPos.y > paddleCentreY || ballRectangle.intersects(paddleRectangle) && this.ballVelocity.y > mouseVelocity.y) {

                //you hit it!!
                this.ballPos.y = mousePosition.y - Math.floor(this.paddleSprite.size.y / 2) - ballRadius;
                if (this.ballVelocity.y > 0) {
                    this.ballVelocity.y *= -1;

                    const diff = this.ballPos.x - mousePosition.x;
                    const paddleWidthHalf = Math.floor(this.paddleSprite.size.x / 2);
                    const ballPositionMultiplier = Math.min(Math.abs(diff) / paddleWidthHalf, 0.8) ** 1.2;

                    const bounceVelocityX = ballPositionMultiplier * Math.sign(diff) * 3;


                    //const velocityHit = Math.min(1, Math.max(0, Math.abs(this.ballVelocity.y) / 10) - 0.3);
                    this.ballVelocity.x = this.ballVelocity.x + bounceVelocityX * (Math.abs(this.ballVelocity.y + 0.05) / 5);
                }

                this.ballVelocity.y = Math.min(this.ballVelocity.y, this.mouseVelocity!.y * 0.3);

            }
        }


        if (this.ballPos.y - ballRadius > height) {
            //ball death
            this.ballPos = this.getDefaultBallPosition(width, height);
            this.ballVelocity = this.getDefaultBallVelocity();
        }
        paddleCentreY = this.mousePosition?.y ?? 0;
        this.lastOnTop = this.ballPos.y < paddleCentreY ? "ball" : "paddle";

        //brick stuff

        for (const brick of this.bricks) {
            brick.tryCollide(this);
        }
        this.bricks = this.bricks.filter(brick => brick.brickHealth > -1);

        //draw functions
        if (this.ballPos) {
            this.ballSprite.draw(context, ...this.ballPos.xy);
        }

        if (this.mousePosition) {
            this.paddleSprite.draw(context, ...this.mousePosition.xy);
        }
        for (const brick of this.bricks) {
            brick.draw(context);
        }
        this.hud.draw(context, this, width, height);





    }

    private getDefaultBallPosition (width: number, height: number) {
        return new Vector2(Math.ceil(width / 2), Math.ceil(height / 4));
    }

    private getDefaultBallVelocity () {
        return new Vector2(Math.random() * 10 - 5, -5)
    }

}