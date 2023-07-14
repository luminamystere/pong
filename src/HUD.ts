import NumberDisplay from "./NumberDisplay.js";
import Pong from "./Pong.js";
import Sprite from "./Sprite.js";
import Vector2 from "./utility/Vector2.js";

export default class HUD {

    public bestSprite = new Sprite("best");

    public readonly numbers = new NumberDisplay;
    public readonly highScore = new NumberDisplay;
    public draw (context: CanvasRenderingContext2D, pong: Pong, width: number, height: number) {

        this.numbers.draw(context, pong.score, new Vector2(width / 2, height - 20));
        this.bestSprite.draw(context, ...new Vector2(20 + this.bestSprite.size.x, 20).xy);
        this.highScore.draw(context, pong.highScore, new Vector2(20 + this.bestSprite.size.x, 30));

    }
}