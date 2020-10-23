export default class SpriteSheet {
    constructor(image, w = 32, h = 32) {
        this.image = image;
        this.width = w;
        this.height = h;
        this.tiles = new Map();
    }

    define(name, x, y) {
        const buffer = document.createElement('canvas');
        buffer.height = this.height;
        buffer.width = this.width;
        buffer
            .getContext('2d')
            .drawImage(
                this.image,
                this.width * x,
                this.height * y,
                this.width,
                this.height,
                0,
                0,
                this.width,
                this.height);
        this.tiles.set(name, buffer);
    }

    draw(name, context, x, y, msg) {
        const buffer = this.tiles.get(name);
        context.drawImage(buffer, x, y);
        if(msg != ""){
            context.font = "30px Comic Sans MS";
            context.fillStyle = "red";
            context.fillText(msg, x, y + 5)
        }
    }

    drawTile(name, context, x, y) {
        this.draw(name, context, x * this.width, y * this.height);
    }
}
