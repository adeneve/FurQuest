import DatabaseController from './database.js'
import Controller from './controller.js'
import Display from './display.js'
import GameObjectLoader from './GameObjectLoader.js'
import Engine from './engine.js'
import Utils from './Utils.js'


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



var controller;
var engine;
var gameObjects = []
var localGameObjects = []
var interactableNPCs = []
var spriteMap = new Map()
var otherPlayers = new Map()

var player = {};
var dialogBox = {};
var dbc;
var loaded = false;

var display = new Display(gameCanvas, player, engine) 
display.SetScreenDimensions(1200, 676)
display.PrepareScenes();

GameObjectLoader.Initialize(gameObjects, localGameObjects, interactableNPCs, spriteMap).then((objs) => {
    player = objs.player;
    dialogBox = objs.dialogBox;
    dbc = new DatabaseController(gameCanvas, player, otherPlayers, localGameObjects, gameObjects, spriteMap, accountControlModule);
    engine = new Engine(dbc, gameCanvas, player, localGameObjects, gameObjects, interactableNPCs, dialogBox);
    controller = new Controller(gameCanvas, engine, dbc, display, player, msgBox, sendBtn, interactableNPCs)
    GameObjectLoader.LoadLocalObjects(player.scene, localGameObjects, gameObjects)
    debugger;
});


var next = 'default'
requestAnimationFrame(update)

function update(time){

    
    display.LoadScene(player.scene)
        
    localGameObjects.forEach( gameObject => 
        {
            if(!player.playerLoaded) return
            display.player = player
            if(gameObject.scene != player.scene && gameObject.name != "dialogBox"){
                return
            }
            if(gameObject.animating && !gameObject.invisible){ 
            if(gameObject.tempStart == -1) gameObject.tempStart = time
            if(gameObject.start == -1) {
                gameObject.start = time;
                gameObject.tempStart = time
            }

        gameObject.tempTimeElapsed = time - gameObject.tempStart
        
        
        if(gameObject.tempTimeElapsed >= gameObject.speed){
            if(gameObject.isRunning){
                debugger;
                if(gameObject.movingRight){
                    next = gameObject.movementFrameNames.next().value
                }
                if(gameObject.movingLeft){
                    next = gameObject.movementLeftFrameNames.next().value
                }
                
            }
            else if(gameObject.fighting && !gameObject.attacking && !gameObject.hurting){
                debugger;
                next = gameObject.battleIdleFrameNames.next().value
            }
            else if(gameObject.fighting && gameObject.attacking){
                debugger;
                next = gameObject.battleAttackFrameNames.next().value
            }
            else if(gameObject.fighting && gameObject.hurting){
                next = gameObject.battleHurtFrameNames.next().value
            }
            else if(gameObject.interactable || gameObject.mouseAnimate){
                next = gameObject.activeFrameNames.next().value
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
                else if(gameObject.fighting && !gameObject.attacking && !gameObject.hurting){
                    gameObject.battleIdleFrameNames = gameObject.spriteSheet.battleIdleTiles.keys()
                        next = 'battleIdle1'
                }
                else if(gameObject.fighting && gameObject.attacking){
                    gameObject.battleAttackFrameNames = gameObject.spriteSheet.battleAttackTiles.keys()
                        next = 'battleAttack1'
                }
                else if(gameObject.fighting && gameObject.hurting){
                    gameObject.battleHurtFrameNames = gameObject.spriteSheet.battleHurtTiles.keys()
                        next = 'battleHurt1'
                }
                else if(gameObject.interactable || gameObject.mouseAnimate){
                    gameObject.activeFrameNames = gameObject.spriteSheet.activeTiles.keys()
                        next = 'activeDefault'
                }
                else{
                    gameObject.frameNames = gameObject.spriteSheet.tiles.keys()
                    next = 'default'
                }

                gameObject.nextFrame = next
                gameObject.tempStart = time

            }else{
                    gameObject.nextFrame = next
                    gameObject.tempStart = time
            }
        
            
        }
    }

        if(gameObject.isPlayer && !gameObject.fighting){
            var transXY = Utils.translateCoordinates(gameCanvas, true, gameObject.posX, gameObject.posY)
            interactableNPCs.forEach(NPC => {
                if(NPC.scene == gameObject.scene){
                    var diffX = Math.abs(NPC.normX - transXY.transX)
                    var diffY = Math.abs(NPC.normY - transXY.transY)
                    if(diffX < .15 && diffY < .31){
                        NPC.interactable = true
                    }else{
                        NPC.interactable = false
                    }
                }
                
            })
            
        }

        if(gameObject.isMoving){
  
            if(gameObject.moveStart == -1) {
              gameObject.moveStart = time;
            }

            gameObject.timeElapsed = time - gameObject.moveStart
            
            gameObject.posX = gameObject.oldX + gameObject.speedX * gameObject.timeElapsed
            gameObject.posY = gameObject.oldY + gameObject.speedY * gameObject.timeElapsed

            var difX = Math.abs(Math.round(gameObject.posX, 2) - Math.round(gameObject.destX, 2))
            var difY = Math.abs(Math.round(gameObject.posY, 2) - Math.round(gameObject.destY, 2))
            if( difX > gameObject.prevDifX) gameObject.error += Math.abs(gameObject.destX - gameObject.prevDifX)
            if( difY > gameObject.prevDifY) gameObject.error += Math.abs(gameObject.destY - gameObject.prevDifY)
            gameObject.prevDifX = difX
            gameObject.prevDifY = difY
            
            if ( (difX > 1 || difY > 1) && gameObject.error < 3) {

            }else {
                if(gameObject.miniGameVal != 1){
                    gameObject.oldX = gameObject.posX
                    gameObject.oldY = gameObject.posY
                    gameObject.isMoving = false
                    gameObject.isRunning = false
                    gameObject.movingLeft = false
                        gameObject.movingRight = false
                    gameObject.moveStart = -1
                    gameObject.prevDifX = 10000
                    gameObject.prevDifY = 10000
                    gameObject.error = 0
                }else{
                    gameObject.error = 0
                }
                
            }
            

          }

    

        if(gameObject.active && !gameObject.invisible){
            gameObject.sprites.draw(gameObject.nextFrame, gameCanvas.getContext('2d'), gameObject.posX, gameObject.posY, gameObject.message, gameObject)
        }
        
        if(dialogBox.active == true){
            dialogBox.sprites.draw(dialogBox.nextFrame, gameCanvas.getContext('2d'), dialogBox.posX, dialogBox.posY, dialogBox.message, dialogBox)
            engine.drawDialog()
        }
        
    }
    )

requestAnimationFrame(update)
}