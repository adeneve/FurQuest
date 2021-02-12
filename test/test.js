import SpriteSheet from "../src/js/SpriteSheet.js"
import GameObject from "../src/js/GameObject.js"
import Utils from "../src/js/Utils.js"

var assert = require('assert');
const { createCanvas, loadImage } = require('canvas');

var player;
var playerSprites;
const playerSpeed = .17;

const mockGameScreen = {
  "width": 1200,
  "height": 676
}

before(async () => {  
  loadImage("./src/assets/character2.png")
        .then(imageChars => {
            playerSprites = new SpriteSheet(imageChars, 64, 64);
            player = new GameObject(playerSprites, 2, 150);
        })
})

describe('DefaultGameObject', function() {
  describe('#GameObject constructor', function() {
    it('game object should be created with correct default values', function(){
            assert.strictEqual(150, player.speed);
            assert.strictEqual(playerSprites, player.spriteSheet);
            assert.strictEqual(false, player.isMoving)
            assert.strictEqual(false, player.inMiniGame);
            assert.strictEqual(512, player.posX);
    });
  });
});


describe('CalculateMovement', function() {
    describe('#Utils Caculate', function() {
      it('Calculate Movement should set correct speed components', function(){
        const destX = 800, destY = 800;
        Utils.calcMovement(destX, destY, player)
        var diffX = Math.abs(destX - player.posX);
        var diffY = Math.abs(destY - player.posY);
        var diffTot = diffX + diffY 
        var percentX = diffX / diffTot
        var percentY = diffY / diffTot 
        var speedX = playerSpeed * percentX
        var speedY = playerSpeed * percentY
        assert.strictEqual(speedX, player.speedX);
        assert.strictEqual(speedY, player.speedY);
  
      });
      it('Calculate Movement should set correct direction', function(){
        var destX = 800, destY = 800;
        assert.strictEqual(player.movingLeft, false);
        assert.strictEqual(player.movingRight, true);
        destX = 300, destY = 300;
        Utils.calcMovement(destX, destY, player)
        assert.strictEqual(player.movingLeft, true);
        assert.strictEqual(player.movingRight, false);
      });
    });
  });

  describe('TranslateCoordinates', function() {
    describe('#Utils TranslateCoordinates', function() {
      it('Translate Coordinates to Global should return values is normalized form', function(){
        var x = 700, y = 720;
        var transXY = Utils.translateCoordinates(mockGameScreen, true, x, y)
        assert.strictEqual((x - (mockGameScreen.width / 2))/(mockGameScreen.width/2), transXY.transX);
        assert.strictEqual(((mockGameScreen.height / 2) - y)/(mockGameScreen.height/2), transXY.transY);

      });
      it('Translate Coordinates to Local should return values in local form', function(){
        var x = 1, y = 1;
        var transXY = Utils.translateCoordinates(mockGameScreen, false, x, y)
        assert.strictEqual(mockGameScreen.width, transXY.transX);
        assert.strictEqual(0 , transXY.transY);
        x = 0, y = 0;
        var transXY = Utils.translateCoordinates(mockGameScreen, false, x, y)
        assert.strictEqual(mockGameScreen.width/2, transXY.transX);
        assert.strictEqual(mockGameScreen.height/2, transXY.transY);
        x = -1, y = -1;
        var transXY = Utils.translateCoordinates(mockGameScreen, false, x, y)
        assert.strictEqual(0, transXY.transX);
        assert.strictEqual(mockGameScreen.height, transXY.transY);
        x = -1, y = 1;
        var transXY = Utils.translateCoordinates(mockGameScreen, false, x, y)
        assert.strictEqual(0, transXY.transX);
        assert.strictEqual(0, transXY.transY);
        x = 1, y = -1;
        var transXY = Utils.translateCoordinates(mockGameScreen, false, x, y)
        assert.strictEqual(mockGameScreen.width, transXY.transX);
        assert.strictEqual(mockGameScreen.height, transXY.transY);
      });
    });
  });