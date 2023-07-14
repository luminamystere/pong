import NumberDisplay from "./NumberDisplay.js";
import Sprite from "./Sprite.js";
import Vector2 from "./utility/Vector2.js";
export default class HUD {
    bestSprite = new Sprite("best");
    numbers = new NumberDisplay;
    highScore = new NumberDisplay;
    draw(context, pong, width, height) {
        this.numbers.draw(context, pong.score, new Vector2(width / 2, height - 20));
        this.bestSprite.draw(context, ...new Vector2(20 + this.bestSprite.size.x, 20).xy);
        this.highScore.draw(context, pong.highScore, new Vector2(20 + this.bestSprite.size.x, 30));
    }
}
