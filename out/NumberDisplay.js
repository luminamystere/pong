import Sprite from "./Sprite.js";
export default class NumberDisplay {
    numbers = [
        new Sprite("0"),
        new Sprite("1"),
        new Sprite("2"),
        new Sprite("3"),
        new Sprite("4"),
        new Sprite("5"),
        new Sprite("6"),
        new Sprite("7"),
        new Sprite("8"),
        new Sprite("9"),
    ];
    get size() {
        let size;
        for (const sprite of this.numbers) {
            if (size && sprite.loaded && !size.equals(sprite.size)) {
                throw new Error('you broke it! (the number sprite sizes do not match)');
            }
            size ??= sprite.size;
        }
        return size;
    }
    draw(context, number, position) {
        const size = this.size;
        if (!size) {
            return;
        }
        const digits = [];
        while (number || !digits.length) {
            digits.push(number % 10);
            number = (Math.floor(number / 10));
            // number = +(number / 10).toFixed(0);
        }
        const width = size.x * digits.length;
        const height = size.y;
        let right = position.x + (width / 2) - (size.x / 2);
        for (const digit of digits) {
            this.numbers[digit].draw(context, right, position.y);
            right -= size.x;
        }
    }
}
