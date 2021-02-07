import SpriteSheet from "../src/js/SpriteSheet.js"
import GameObject from "../src/js/GameObject.js"
//import {loadImage} from '../src/js/loaders.js'

var assert = require('assert');
const { createCanvas, loadImage } = require('canvas');



describe('DefaultGameObject', function() {
  describe('#GameObject constructor()', function() {
    it('game object should be created with correct default values', function(){
        return loadImage("./src/assets/character2.png")
        .then(imageChars => {
            var playerSprites = new SpriteSheet(imageChars, 64, 64);
            var player = new GameObject(playerSprites, 2, 150);
            assert.strictEqual(150, player.speed);
            assert.strictEqual(playerSprites, player.spriteSheet);
            assert.strictEqual(false, player.animating)
        })

    });
  });
});