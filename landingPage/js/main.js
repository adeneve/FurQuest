import DatabaseController from './database.js'
import Controller from './controller.js'
import Display from './display.js'
import SpriteSheet from './SpriteSheet.js'
import GameObject from './GameObject.js'
import Engine from './engine.js'
import {loadImage} from './loaders.js'


var gameCanvas = document.getElementById("gameCanvas") 
var msgBox = document.getElementById("comment")
var sendBtn = document.getElementById("sendMsg")

var accountControlModule = {
    "btnSignUp" : document.getElementById('btnSignUp'),
    "btnLogIn" : document.getElementById('btnLogIn'),
    "createAcc" : document.getElementById('createAccMenu'),
    "logInMenu" : document.getElementById('logInMenu'),
    "logOutMenu" : document.getElementById('logOutMenu'),
    "username" : document.getElementById('username'),
    "btnCloseLogin" : document.getElementById('btnCloseLogIn'),
    "btnCloseSignUp" : document.getElementById('btnCloseSignUp'),
    "window" : window
}




var currentWidth = window.innerWidth * .75;
var currentHeight = window.innerHeight * .85
var display = new Display(gameCanvas, currentWidth, currentHeight) 
var controller = 0;
var engine = 0;
display.loadScene()
var gameObjects = []
var otherPlayers = new Map()
var sprites = -1
var scene = new Image();
scene.src = '../assets/town.png'



loadImage('../assets/character_sheet.png')
.then(image => {
    sprites = new SpriteSheet(image);
    sprites.define('default', 0, 0);
    sprites.define('walk', 1, 0);
    var player = new GameObject(sprites, 2, 500)
    const dbc = new DatabaseController(gameCanvas, player, otherPlayers, gameObjects, sprites, accountControlModule );
    engine = new Engine(dbc, gameCanvas, player);
    controller = new Controller(gameCanvas, engine, player, msgBox, sendBtn)
    window.onbeforeunload = function() {
        dbc.loguserOut()
        return false;
     }
    requestAnimationFrame(update)
});

var next = 'default'
function update(time){

    //gameCanvas.getContext('2d').drawImage(scene, 0, 0);
    gameCanvas.getContext('2d').drawImage(scene, 0, 0, scene.width,    scene.height,     // source rectangle
        0, 0, gameCanvas.width, gameCanvas.height); // destination rectangle
        
    gameObjects.forEach( gameObject => 
        {
            if(gameObject.isMoving == true){
            if(gameObject.tempStart == -1) gameObject.tempStart = time
            if(gameObject.start == -1) {
                gameObject.start = time;
                gameObject.tempStart = time
            }

        gameObject.tempTimeElapsed = time - gameObject.tempStart
        
        
        if(gameObject.tempTimeElapsed >= gameObject.speed){
            gameObject.currentStep += 1
            
            next = gameObject.frameNames.next().value
            

            if(next == undefined) {
                gameObject.frameNames = gameObject.spriteSheet.tiles.keys()
                next = 'default'
                gameObject.nextFrame = next

            }else{
                    gameObject.nextFrame = next
                    gameObject.tempStart = time
            }
        
            
        }
    }
    

        if(gameObject.active){
            sprites.draw(gameObject.nextFrame, gameCanvas.getContext('2d'), gameObject.posX, gameObject.posY, gameObject.message)
        }
        
        
    }
    )

requestAnimationFrame(update)
}


