export default class SpriteSheet {
    constructor(image, w = 32, h = 32) {
        this.image = image;
        this.width = w;
        this.height = h;
        this.tiles = new Map();
        this.movementTiles = new Map();
        this.movementTilesLeft = new Map();
        this.battleIdleTiles = new Map();
        this.battleAttackTiles = new Map();
        this.battleHurtTiles = new Map();
        this.activeTiles = new Map();
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
            if(z == 1){
                this.movementTiles.set(name, buffer);
            }
            if(z == 2){
                this.movementTilesLeft.set(name, buffer);
            }
            if(z == 3){
                this.battleIdleTiles.set(name, buffer)
            }
            if(z == 4){
                this.battleAttackTiles.set(name, buffer)
            }
            if(z == 5){
                this.battleHurtTiles.set(name, buffer)
            }
            if(z == 6){
                this.activeTiles.set(name, buffer)
            }
    }

    draw(name, context, x, y, msg, gameObj) {

        var buffer = this.tiles.get(name);
        if(name.includes("moving")){
            buffer = this.movementTiles.get(name);
        }
        if(name.includes("Left")){
            buffer = this.movementTilesLeft.get(name);
        }
        if(name.includes("battleIdle")){
            buffer = this.battleIdleTiles.get(name);
        }
        if(name.includes("battleAttack")){
            buffer = this.battleAttackTiles.get(name);
        }
        if(name.includes("battleHurt")){
            buffer = this.battleHurtTiles.get(name);
        }
        if(name.includes("active")){
            buffer = this.activeTiles.get(name);
        }
        
        context.drawImage(buffer, x-this.width/2, y -this.height/2);
        

        if(msg != ""){
            context.fillStyle = "#FFFFFF";
            context.globalAlpha = 0.4;
            context.fillRect( x - this.width/2 - 15, y - this.height/2 - 35, 150 * ((msg.length / 20) + 1), 30);
            context.globalAlpha = 1;
            context.font = "20px Comic Sans MS";
            context.fillStyle = "#000000";
            context.fillText(msg, x - this.width/2, y - this.height/2 - 10)
        }

        if(gameObj != undefined && (gameObj.isPlayer || gameObj.isOtherPlayer)){
            context.font = "15px Comic Sans MS";
            context.fillStyle = "#000000";
            context.fillText(gameObj.name, x - this.width/2 + 10, y - this.height/2 + 80)
        }
        
        
    }

    drawTile(name, context, x, y) {
        this.draw(name, context, x * this.width, y * this.height);
    }
}
