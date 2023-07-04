import NumberDisplay from "./NumberDisplay.js";
import Pong from "./Pong.js";
import Vector2 from "./utility/Vector2.js";

export default class HUD {

    public readonly numbers = new NumberDisplay;
    public draw (context: CanvasRenderingContext2D, pong: Pong, width: number, height: number) {

        this.numbers.draw(context, pong.score, new Vector2(width / 2, height - 20));
    }
}