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

    defineSixtyFourBit(name, x, y){
        const buffer = document.createElement('canvas');
        buffer.height = this.height * 2;
        buffer.width = this.width * 2;
        buffer
            .getContext('2d')
            .drawImage(
                this.image,
                this.width * x * 2,
                this.height * y * 2,
                this.width * 2,
                this.height * 2,
                0,
                0,
                this.width * 2,
                this.height * 2);
        this.tiles.set(name, buffer);
    }

    draw(name, context, x, y, msg) {
        const buffer = this.tiles.get(name);
        context.drawImage(buffer, x-this.width/2, y -this.height/2);
        if(msg != ""){
            context.font = "20px Comic Sans MS";
            context.fillStyle = "#69fff0";
            context.fillText(msg, x - this.width/2, y - this.height/2)
        }
    }

    drawTile(name, context, x, y) {
        this.draw(name, context, x * this.width, y * this.height);
    }
}
