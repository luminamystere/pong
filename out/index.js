import Pong from "./Pong.js";
console.log("uwu");
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
let width = 0;
let height = 0;
function resize() {
    width = canvas.width = Math.ceil(window.innerWidth / 2);
    height = canvas.height = Math.ceil(window.innerHeight / 2);
    canvas.style.width = `${width * 2}px`;
    canvas.style.height = `${height * 2}px`;
}
window.addEventListener("resize", resize);
resize();
let context = null;
const game = new Pong(width, height);
function render() {
    context ??= canvas.getContext("2d");
    requestAnimationFrame(render);
    if (!context)
        return;
    context.clearRect(0, 0, width, height);
    //here's the pong!
    game.render(context, width, height);
}
render();
