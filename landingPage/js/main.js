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
var interactableNPCs = []
var otherPlayers = new Map()
var sprites = -1
var scene = new Image();
scene.src = '../assets/town.png'
var tutorialBro = -1;
var player = -1;
var dialogBox = -1;
var dbc = 0;



loadImage('../assets/character.png')
.then(image => {
    sprites = new SpriteSheet(image);
    sprites.define('default', 0, 0);
    sprites.define('walk', 1, 0);
    player = new GameObject(sprites, 2, 250)
    var tutorialBroSprites = new SpriteSheet(image, 64, 64);
    tutorialBroSprites.define("default", 1,0);
    tutorialBroSprites.define("wave1", 2, 0);
    tutorialBroSprites.define("wave2", 3, 0);
    tutorialBroSprites.define("wave3", 4, 0);
    tutorialBroSprites.define("wave4", 5, 0);
    tutorialBro = new GameObject(tutorialBroSprites, 5, 250);
    tutorialBro.sprites = tutorialBroSprites;
    tutorialBro.active = true
    tutorialBro.isMoving = false
    tutorialBro.name = "tBro"
    
    gameObjects.push(tutorialBro);
    interactableNPCs.push(tutorialBro)
    dbc = new DatabaseController(gameCanvas, player, otherPlayers, gameObjects, sprites, accountControlModule );
    var transXY = dbc.translateCoordinates(false, -.34, .1, gameCanvas)
    tutorialBro.posX = transXY.transX
    tutorialBro.posY = transXY.transY
    tutorialBro.normX = -.34
    tutorialBro.normY = .1
    engine = new Engine(dbc, gameCanvas, player, gameObjects, interactableNPCs, dialogBox);
    controller = new Controller(gameCanvas, engine, player, msgBox, sendBtn)
    window.onbeforeunload = function() {
        dbc.loguserOut()
        return false;
     }
    requestAnimationFrame(update)
});

loadImage('../assets/dialogBox.png')
.then(image => {
    var dialogBoxSprites = new SpriteSheet(image, 610, 260)
    dialogBoxSprites.define("default", 0, 0, 1);
    dialogBox = new GameObject(dialogBoxSprites, 1, 500);
    dialogBox.sprites = dialogBoxSprites
    dialogBox.active = false
    var transXY = dbc.translateCoordinates(false, 0, -.8, gameCanvas)
    dialogBox.posX = transXY.transX
    dialogBox.posY = transXY.transY
    engine.dialogBox = dialogBox
})

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

        if(gameObject.isPlayer){
            var gameScreen = gameCanvas.getBoundingClientRect(); 
            var transXY = dbc.translateCoordinates(true, gameObject.posX, gameObject.posY +gameScreen.top, gameCanvas)
            
            interactableNPCs.forEach(NPC => {
                var diffX = Math.abs(NPC.normX - transXY.transX)
                var diffY = Math.abs(NPC.normY - transXY.transY)
                if(diffX < .15 && diffY < .31){
                    NPC.isMoving = true
                    NPC.interactable = true
                }else{
                    NPC.isMoving = false
                    NPC.frameNames = NPC.spriteSheet.tiles.keys()
                    NPC.next = 'default'
                    NPC.nextFrame = NPC.next
                    NPC.interactable = false
                }
            })
            
        }
    

        if(gameObject.active){
            gameObject.sprites.draw(gameObject.nextFrame, gameCanvas.getContext('2d'), gameObject.posX, gameObject.posY, gameObject.message)
        }
        
        if(dialogBox.active == true){
            dialogBox.sprites.draw(dialogBox.nextFrame, gameCanvas.getContext('2d'), dialogBox.posX, dialogBox.posY, dialogBox.message)
            engine.drawDialog()
        }
        
    }
    )

requestAnimationFrame(update)
}
