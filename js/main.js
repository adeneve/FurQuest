import DatabaseController from './database.js'
import Controller from './controller.js'
import Display from './display.js'
import SpriteSheet from './SpriteSheet.js'
import GameObject from './GameObject.js'
import Engine from './engine.js'
import {loadImage} from './loaders.js'


var gameCanvas = document.getElementById("gameCanvas") 
const display = new Display(gameCanvas, 1024, 800) 
var controller = 0;
var engine = 0;
display.loadScene()
var gameObjects = []
var otherPlayers = []
var sprites = -1
var scene = new Image();
scene.src = '../assets/library.png'



loadImage('../assets/tiles.png')
.then(image => {
    sprites = new SpriteSheet(image);
    sprites.define('default', 0, 0);
    sprites.define('sky', 3, 23);
    var player = new GameObject(sprites, 2, 500)
    const dbc = new DatabaseController(gameCanvas, player, otherPlayers, gameObjects, sprites);
    engine = new Engine(dbc, gameCanvas, player);
    controller = new Controller(gameCanvas, engine, player)
    requestAnimationFrame(update)
});

var next = 'default'
function update(time){

    gameCanvas.getContext('2d').drawImage(scene, 0, 0);
        
    gameObjects.forEach( gameObject => 
        {
            if(gameObject.tempStart == -1) gameObject.tempStart = time

        gameObject.tempTimeElapsed = time - gameObject.tempStart
        
        
        if(gameObject.tempTimeElapsed >= gameObject.speed){
            gameObject.currentStep += 1
            next = gameObject.frameNames.next().value

            if(next == undefined) {
                gameObject.frameNames = gameObject.spriteSheet.tiles.keys()
                next = 'default'

            }else{
                gameObject.nextFrame = next
                gameObject.tempStart = time
            }
            
        }

        
        sprites.draw(next, gameCanvas.getContext('2d'), gameObject.posX, gameObject.posY)
    }
    )

requestAnimationFrame(update)
}



