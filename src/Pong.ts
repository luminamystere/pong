import Ball from "./Ball.js";
import Brick from "./Brick.js";
import HUD from "./HUD.js";
import Sprite from "./Sprite.js";
import Rectangle from "./utility/Rectangle.js";
import Vector2 from "./utility/Vector2.js";

const stylesheetElement = document.getElementById("stylesheet") as HTMLLinkElement;

export default class Pong {


    public lastMousePosition?: Vector2.Immutable;
    public mousePosition?: Vector2.Immutable;
    public mouseVelocity?: Vector2.Immutable;
    public keyboard: Record<string, number> = {};
    public mouse: Record<string, number> = {};
    public startTime = Date.now();
    public currentRow = 0;
    public gameRunning = true;
    public highScoreDisplay = localStorage.getItem("highscore") ?? "0";
    public highScore = parseInt(this.highScoreDisplay);
    public endTime = 0;

    public constructor () {
        window.addEventListener("mousemove", event => {
            this.mousePosition = new Vector2.Immutable(Math.ceil(event.clientX / 2), Math.ceil(event.clientY / 2))
        });

        window.addEventListener("keydown", event => {
            this.keyboard[event.key] = Date.now();
            if (event.key == "F6") {
                stylesheetElement.href = "index.css?" + Math.random().toString().slice(2);
            }
        });

        window.addEventListener("keyup", event =>
            delete this.keyboard[event.key]);

        window.addEventListener("mousedown", event => {
            this.mouse[event.button] ??= Date.now();
            if (!this.gameRunning) {
                this.bricks.length = 0;
                this.gameRunning = true;
                this.currentRow = 0;
                this.startTime = Date.now();
                console.log("restarted!");
                document.getElementById("gameOverOverlay")?.remove();
                console.log(this.elapsedTime);
                this.score = 0;
                this.ball = new Ball();
            }
        });
        window.addEventListener("mouseup", event => {
            delete this.mouse[event.button];
        });

        document.addEventListener("visibilitychange", () => this.keyboard = {});

        (window as any).pong = this;
    }

    public paddleSprite = new Sprite("paddle");

    public paddlePos = new Vector2(0, 0);

    public ball = new Ball();

    public bricks: Brick[] = [];

    public get paddleRectangle () {
        return Rectangle.fromCentre(this.mousePosition ?? Vector2.ZERO, this.paddleSprite.size);
    }

    public get elapsedTime () {
        return Date.now() - this.startTime;
    }

    public spawnBrick (width: number, height: number) {
        if (!Brick.brickSize.x) {
            return;
        }

        if ((this.currentRow * Brick.brickSize.y) - Brick.brickSize.y / 2 - (Brick.brickSpeed * this.elapsedTime) < 0) {
            const startX = (width / 2) - (Brick.brickSize.x * 3) + Brick.brickSize.x / 2;
            for (let i = 0; i < 6; i++) {
                const spawnPosition = new Vector2(startX + Brick.brickSize.x * i, -this.currentRow * Brick.brickSize.y);
                this.bricks.push(new Brick(spawnPosition, this.currentRow))
                //console.log("spawned brick at ", spawnPosition.xy, Brick.brickSize.xy, this.currentRow);
            }
            this.currentRow += 1;
        }
    }

    public gameOver () {
        this.gameRunning = false;
        //this.bricks.length = 0;
        const gameOverOverlay = document.createElement("div");
        gameOverOverlay.setAttribute("id", "gameOverOverlay");
        const gameOverText = document.createElement('h1');
        gameOverText.setAttribute("id", "gameOverText");
        gameOverText.textContent = ("Game Over!");
        const scoreText = document.createElement("h4");
        scoreText.setAttribute("id", "score");
        scoreText.textContent = ("Score: " + this.score);
        const clickText = document.createElement("h3");
        clickText.setAttribute("id", "clickToContinue");
        clickText.textContent = ("Click to Restart!");
        gameOverOverlay.append(gameOverText, scoreText, clickText);


        document.body.append(gameOverOverlay);


    }


    //score
    public score = 0;
    public hud = new HUD();

    public render (context: CanvasRenderingContext2D, width: number, height: number) {

        this.mouseVelocity = this.mousePosition?.copyMutable()
            .subtractVector(this.lastMousePosition ?? this.mousePosition)
            .copyImmutable();
        this.lastMousePosition = this.mousePosition;


        if (this.gameRunning) {
            this.spawnBrick(width, height);
        } else {
            for (const brick of this.bricks) {
                brick.draw(context, this.endTime);
            }
            return;
        }

        const ball = this.ball;
        ball.ballPhysicsUpdate(width, height, this);

        //brick stuff
        for (const brick of this.bricks) {
            if (brick.getBrickPosition(this.elapsedTime).y > height - brick.brickSprite.size.y / 2) {
                console.log("ouchies!");
                this.endTime = this.elapsedTime;
                this.gameOver();
                return;
            }
            brick.tryCollide(this);

        }
        this.bricks = this.bricks.filter(brick => brick.brickHealth > -1);


        if (this.score >= this.highScore) {
            this.highScore = this.score;
            localStorage.setItem("highscore", this.highScore.toString());
        }


        //draw functions
        ball.draw(context);

        if (this.mousePosition) {
            this.paddleSprite.draw(context, ...this.mousePosition.xy);
        }

        for (const brick of this.bricks) {
            brick.draw(context, this.elapsedTime);
        }


        this.hud.draw(context, this, width, height);

    }

}