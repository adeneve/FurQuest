import DatabaseController from './database.js'
import Controller from './controller.js'
import Display from './display.js'
import SpriteSheet from './SpriteSheet.js'
import GameObject from './GameObject.js'
import Engine from './engine.js'
import {loadImage} from './loaders.js'


var gameCanvas = document.getElementById("gameCanvas") 
var context = gameCanvas.getContext('2d')
context.webkitImageSmoothingEnabled = false;
context.mozImageSmoothingEnabled = false;
context.imageSmoothingEnabled = false;
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
console.log(currentWidth)
var display = new Display(gameCanvas, 1200, 676) 
var controller = 0;
var engine = 0;
//display.loadScene()
var gameObjects = []
var interactableNPCs = []
var otherPlayers = new Map()
var sprites = -1
var movingSprites = -1
var scene = new Image();
scene.src = '../assets/town1200.png'
var sceneOpenCafe = new Image();
sceneOpenCafe.src = '../assets/town1200openCafe.png'
var sceneCafe = new Image();
sceneCafe.src = '../assets/cafe.png'
var tutorialBro = -1;
var blueHairBro = -1;
var fountain = -1;
var player = -1;
var dialogBox = -1;
var dbc = 0;



loadImage('../assets/character.png')
.then(image => {
    sprites = new SpriteSheet(image, 64, 64);
    movingSprites = new SpriteSheet(image, 64, 64)
    sprites.define('default', 0, 3);
    sprites.define('idle1', 1, 3);
    sprites.define('idle2', 2, 3);
    sprites.define('movingDefault', 4, 3, 1)
    sprites.define('moving2', 5 ,3, 1)
    sprites.define('moving3', 6 ,3, 1)
    sprites.define('moving4', 7 ,3, 1)
    sprites.define('movingDefaultLeft', 0, 4, 2)
    sprites.define('movingLeft2', 1 ,4, 2)
    sprites.define('movingLeft3', 2 ,4, 2)
    sprites.define('movingLeft4', 3 ,4, 2)
    player = new GameObject(sprites, 2, 200)
    var tutorialBroSprites = new SpriteSheet(image, 64, 64);
    tutorialBroSprites.define("default", 0,0);
    tutorialBroSprites.define("wave1", 1, 0);
    tutorialBroSprites.define("wave2", 2, 0);
    tutorialBroSprites.define("wave3", 3, 0);
    tutorialBroSprites.define("wave4", 4, 0);
    tutorialBroSprites.define("wave5", 5, 0);
    tutorialBro = new GameObject(tutorialBroSprites, 5, 250);
    tutorialBro.scene = 0
    tutorialBro.sprites = tutorialBroSprites;
    tutorialBro.active = true
    tutorialBro.isMoving = false
    tutorialBro.name = "Mysterious Stranger"

    var blueHairBroSprites = new SpriteSheet(image, 64, 64);
    blueHairBroSprites.define("default", 0,2);
    blueHairBroSprites.define("idle1", 1, 2);
    blueHairBroSprites.define("idle2", 2, 2);
    blueHairBro = new GameObject(blueHairBroSprites, 3, 400);
    blueHairBro.sprites = blueHairBroSprites;
    blueHairBro.active = true
    blueHairBro.isMoving = false
    blueHairBro.scene = 0
    blueHairBro.name = "Bobby Scar"

    
    gameObjects.push(tutorialBro);
    gameObjects.push(blueHairBro);
    interactableNPCs.push(tutorialBro)
    interactableNPCs.push(blueHairBro)
    dbc = new DatabaseController(gameCanvas, player, otherPlayers, gameObjects, sprites, accountControlModule );
    var transXY = dbc.translateCoordinates(false, -.57, -.12, gameCanvas)
    tutorialBro.posX = transXY.transX
    tutorialBro.posY = transXY.transY
    tutorialBro.normX = -.57
    tutorialBro.normY = -.12

    var transXY = dbc.translateCoordinates(false, .3, 0, gameCanvas)
    blueHairBro.posX = transXY.transX
    blueHairBro.posY = transXY.transY
    blueHairBro.normX = .3
    blueHairBro.normY = 0
    engine = new Engine(dbc, gameCanvas, player, gameObjects, interactableNPCs, dialogBox);
    controller = new Controller(gameCanvas, engine, player, msgBox, sendBtn)

    


    loadImage('../assets/dialogBox.png')
    .then(image => {
    var dialogBoxSprites = new SpriteSheet(image, 610, 260)
    dialogBoxSprites.define("default", 0, 0);
    dialogBox = new GameObject(dialogBoxSprites, 1, 500);
    dialogBox.sprites = dialogBoxSprites
    dialogBox.active = false
    var transXY = translateCoordinates(false, 0, -.8, gameCanvas)
    dialogBox.posX = transXY.transX
    dialogBox.posY = transXY.transY
    dialogBox.name = "dialogBox"
    engine.dialogBox = dialogBox
    })

    window.onbeforeunload = function() {
        dbc.loguserOut()
        return false;
     }
     window.onunload = function() {
         dbc.loguserOut()
         return false
     }

    
});



loadImage('../assets/fountain.png')
.then(image => {
    var fountainSprites = new SpriteSheet(image, 128, 128)
    fountainSprites.define("default", 0, 0);
    fountainSprites.define("splash1", 1, 0);
    fountainSprites.define("splash2", 2, 0);
    fountainSprites.define("splash3", 3, 0);
    //fountainSprites.define("splash4", 0, 1);
    //fountainSprites.define("splash5", 1, 1);
    //fountainSprites.define("splash6", 2, 1);
   // fountainSprites.define("splash7", 3, 1);
    fountain = new GameObject(fountainSprites, 1, 240);
    fountain.sprites = fountainSprites
    fountain.active = true
    fountain.isMoving = false
    var transXY = translateCoordinates(false, -0.4, -.3, gameCanvas)
    fountain.posX = transXY.transX
    fountain.posY = transXY.transY
    fountain.scene = 0
    gameObjects.push(fountain)
})

loadImage('../assets/store.jpg')
.then(image => {
    requestAnimationFrame(update)
})

var next = 'default'
function update(time){

    //gameCanvas.getContext('2d').drawImage(scene, 0, 0);
    //var currentScene = engine.getPlayerScene()
    if(player.scene == 0){
        if(!engine.enteringCafe){
            gameCanvas.getContext('2d').drawImage(scene, 0, 0, scene.width,    scene.height,     // source rectangle
                0, 0, gameCanvas.width, gameCanvas.height); // destination rectangle
        }else{
            gameCanvas.getContext('2d').drawImage(sceneOpenCafe, 0, 0, scene.width,    scene.height,     // source rectangle
                0, 0, gameCanvas.width, gameCanvas.height); // destination rectangle
        }
    }
    else if(player.scene == 1){
        gameCanvas.getContext('2d').drawImage(sceneCafe, 0, 0, sceneCafe.width,    sceneCafe.height,     // source rectangle
            0, 0, gameCanvas.width, gameCanvas.height); // destination rectangle
    }
    

    
    
        
        
    gameObjects.forEach( gameObject => 
        {
            if(!player.playerLoaded) return
            if(gameObject.scene != player.scene && gameObject.name != "dialogBox"){
                return
            }
            if(gameObject.animating){ 
            if(gameObject.tempStart == -1) gameObject.tempStart = time
            if(gameObject.start == -1) {
                gameObject.start = time;
                gameObject.tempStart = time
            }

        gameObject.tempTimeElapsed = time - gameObject.tempStart
        
        
        if(gameObject.tempTimeElapsed >= gameObject.speed){
            if(gameObject.isRunning){
                if(gameObject.movingRight){
                    next = gameObject.movementFrameNames.next().value
                }
                if(gameObject.movingLeft){
                    next = gameObject.movementLeftFrameNames.next().value
                }
            }
            else{
                next = gameObject.frameNames.next().value
            }

            gameObject.currentStep += 1
            

            if(next == undefined) {
                if(gameObject.isRunning){
                    if(gameObject.movingRight){
                        gameObject.movementFrameNames = gameObject.spriteSheet.movementTiles.keys()
                        next = 'movingDefault'
                    }
                    if(gameObject.movingLeft){
                        gameObject.movementLeftFrameNames = gameObject.spriteSheet.movementTilesLeft.keys()
                        next = 'movingDefaultLeft'
                    }
                }
                else{
                    gameObject.frameNames = gameObject.spriteSheet.tiles.keys()
                    next = 'default'
                }

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
                    //NPC.isMoving = true
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

        if(gameObject.isMoving){
    
              
                
            if(gameObject.moveStart == -1) {
              gameObject.moveStart = time;
            }

          
          
            var timeElapsed = time - gameObject.moveStart
            
            var tempX = gameObject.oldX + gameObject.speedX * timeElapsed
            var tempY = gameObject.oldY + gameObject.speedY * timeElapsed
            
            var diffX = Math.abs(tempX - gameObject.oldX);
            var diffY = Math.abs(tempY - gameObject.oldY);
            var diffSqX = diffX * diffX 
            var diffSqY = diffY * diffY 
            var totDist =  Math.sqrt( diffSqX + diffSqY)
            
            if(totDist >= gameObject.totalDistanceReq) {
                gameObject.oldX = gameObject.posX
                gameObject.oldY = gameObject.posY
                gameObject.moveStart = -1
                gameObject.isMoving = false
                gameObject.isRunning = false
                gameObject.movingLeft = false
                      gameObject.movingRight = false
                return
            }
            
            gameObject.posX = gameObject.oldX + gameObject.speedX * timeElapsed
            gameObject.posY = gameObject.oldY + gameObject.speedY * timeElapsed
            
            
            if (Math.abs(Math.round(gameObject.posX, 2) - Math.round(gameObject.destX, 2)) > 1 || Math.abs(Math.round(gameObject.posY, 2) - Math.round(gameObject.destY, 2)) > 1) {

            }else {
                gameObject.oldX = gameObject.posX
                gameObject.oldY = gameObject.posY
                gameObject.isMoving = false
                gameObject.isRunning = false
                gameObject.movingLeft = false
                      gameObject.movingRight = false
                gameObject.moveStart = -1
            }

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

function translateCoordinates(toGlobal, x, y){
    var boundingRect = gameCanvas.getBoundingClientRect();
    var transX = 0
    var transY = 0
    if(toGlobal){
      transX = ((x )-(gameCanvas.width/2))/(gameCanvas.width/2); 
            transY = ((gameCanvas.height/2)-(y - boundingRect.top))/(gameCanvas.height/2);
    }
    else{
      transX = ((gameCanvas.width/2) * (x)) + (gameCanvas.width/2)   
      transY = (gameCanvas.height/2) - ((gameCanvas.height/2) * (y))
    }
    return {transX, transY}
  }
