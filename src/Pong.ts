import Ball from "./Ball.js";
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

    public paddleSprite = new Sprite("paddle");

    public paddlePos = new Vector2(0, 0);

    public ball = new Ball();

    public bricks = [
        new Brick(new Vector2(200, 200)),
        new Brick(new Vector2(300, 200)),
        new Brick(new Vector2(400, 200)),
        new Brick(new Vector2(500, 200)),
    ];

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

        const ball = this.ball;

        ball.ballPhysicsUpdate(width, height, this);
        //brick stuff

        for (const brick of this.bricks) {
            brick.tryCollide(this);
        }
        this.bricks = this.bricks.filter(brick => brick.brickHealth > -1);


        //draw functions

        ball.draw(context);

        if (this.mousePosition) {
            this.paddleSprite.draw(context, ...this.mousePosition.xy);
        }
        for (const brick of this.bricks) {
            brick.draw(context);
        }
        this.hud.draw(context, this, width, height);





    }

}