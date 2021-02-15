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

        var scale = 1;
        if(gameObj.isPlayer || gameObj.isOtherPlayer){
            if(gameObj.scene == 1){
                scale = 1.2;
            }
        }
        if(gameObj.doScale){
            scale = gameObj.scale
        }
        
        if(gameObj.name == "Inventory"){
            context.fillStyle = 'rgba(0,225,225,0.5)';
        context.fillRect( 980, 620, 330, 200);
        }
        
        context.drawImage(buffer, x-this.width/2, y -this.height/2, this.width*scale, this.height*scale);

       

        

        if(msg != ""){
            var msgSectionA = msg.substring(0,32)
            if(msg.substring(32,33) != " " && msg.length >= 33 && msg.substring(31,32) != " ") msgSectionA += "-"
            var msgSectionB = msg.substring(32, 64)
            if(msg.substring(64,65) != " " && msg.length>64 && msg.substring(63,64) != " ") msgSectionB += "-"
            var msgSectionC = msg.substring(64,101)
            context.fillStyle = "#FFFFFF";
            context.globalAlpha = 0.4;
            if(msg.length < 33)  context.fillRect( x - this.width/2 - 12, y - this.height/2 - 35, Math.min(165 * (1 + msg.length/20), 330), 30);
            if(msg.length >= 33 && msg.length <= 64)  context.fillRect( x - this.width/2 - 12, y - this.height/2 - 35, Math.min(165 * (1 + msg.length/20), 330), 60);
            if(msg.length > 64) context.fillRect( x - this.width/2 - 12, y - this.height/2 - 50, Math.min(165 * (1 + msg.length/20), 330), 75);

            context.globalAlpha = 1;
            context.font = "20px Comic Sans MS";
            context.fillStyle = "#000000";
            if(msg.length <= 64){
                context.fillText(msgSectionA, x - this.width/2, y - this.height/2 - 10)
            context.fillText(msgSectionB, x - this.width/2, y - this.height/2 + 10)
            context.fillText(msgSectionC, x - this.width/2, y - this.height/2 + 30 )
            }else{
                context.fillText(msgSectionA, x - this.width/2, y - this.height/2 - 30)
            context.fillText(msgSectionB, x - this.width/2, y - this.height/2 - 10)
            context.fillText(msgSectionC, x - this.width/2, y - this.height/2 + 10 )
            }
            
            
        }

        if(gameObj != undefined && (gameObj.isPlayer || gameObj.isOtherPlayer)){
            context.font = "15px Comic Sans MS";
            context.fillStyle = "#000000";
            if(gameObj.isOtherPlayer){
                context.fillText(gameObj.name, x - 5 , y + this.height/2 - 10)
            }else{
                context.font = "15px Comic Sans MS";
                context.fillStyle = "#55F1D5";
                context.fillText(gameObj.name, x - 5 , y + this.height/2 - 10)
            }
        }
        
        
    }

    drawTile(name, context, x, y) {
        this.draw(name, context, x * this.width, y * this.height);
    }
}
