export default class SpriteSheet {
    constructor(image, w = 32, h = 32) {
        this.image = image;
        this.width = w;
        this.height = h;
        this.tiles = new Map();
        this.movementTiles = new Map();
    }

    define(name, x, y, z = 0) {
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
            if(z == 0){
                this.tiles.set(name, buffer);
            }
            else{
                this.movementTiles.set(name, buffer);
            }
    }

    draw(name, context, x, y, msg) {
        var buffer = this.tiles.get(name);
        if(name.includes("moving")){
            buffer = this.movementTiles.get(name);
        }
        
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
