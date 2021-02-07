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



var controller;
var engine;
//display.loadScene()
var gameObjects = []
var interactableNPCs = []
var spriteMap = new Map()
var otherPlayers = new Map()
var tutorialBro;
var blueHairBro;
var fountain;
var player;
var dialogBox;
var dbc;
var loaded = false;

var display = new Display(gameCanvas, player) 
display.SetScreenDimensions(1200, 676)
display.PrepareScenes();

loadImage('../assets/character2.png')
.then(imageChars => {
    


    var BearBrownSprites = new SpriteSheet(imageChars, 64, 64);
    BearBrownSprites.define('default', 0, 1);
    BearBrownSprites.define('movingDefault', 1, 1, 1)
    BearBrownSprites.define('moving2', 1 ,1, 1)
    BearBrownSprites.define('moving3', 2, 1, 1)
    BearBrownSprites.define('moving4', 3 ,1, 1)
    BearBrownSprites.define('movingDefaultLeft', 6, 1, 2)
    BearBrownSprites.define('movingLeft2', 6 , 1, 2)
    BearBrownSprites.define('movingLeft3', 5 ,1, 2)
    BearBrownSprites.define('movingLeft4', 4 ,1, 2)
    BearBrownSprites.define('battleIdle1', 0 ,5, 3)
    BearBrownSprites.define('battleIdle2', 1 ,5, 3)
    BearBrownSprites.define('battleAttack1', 1 ,5, 4)
    BearBrownSprites.define('battleAttack2', 2 ,5, 4)
    BearBrownSprites.define('battleHurt1', 0 ,5, 5)
    BearBrownSprites.define('battleHurt2', 3 ,5, 5)

    spriteMap.set("Brown", BearBrownSprites);


    var BearGreySprites = new SpriteSheet(imageChars, 64, 64);
    BearGreySprites.define('default', 0, 2);
    BearGreySprites.define('movingDefault', 1, 2, 1)
    BearGreySprites.define('moving2', 1 ,2, 1)
    BearGreySprites.define('moving3', 2, 2, 1)
    BearGreySprites.define('moving4', 3 ,2, 1)
    BearGreySprites.define('movingDefaultLeft', 6, 2, 2)
    BearGreySprites.define('movingLeft2', 6 , 2, 2)
    BearGreySprites.define('movingLeft3', 5 ,2, 2)
    BearGreySprites.define('movingLeft4', 4 ,2, 2)
    BearGreySprites.define('battleIdle1', 0 ,6, 3)
    BearGreySprites.define('battleIdle2', 1 ,6, 3)
    BearGreySprites.define('battleAttack1', 1 ,6, 4)
    BearGreySprites.define('battleAttack2', 2 ,6, 4)
    BearGreySprites.define('battleHurt1', 0 ,6, 5)
    BearGreySprites.define('battleHurt2', 3 ,6, 5)

    spriteMap.set("Grey", BearGreySprites);

    var BearBlackSprites = new SpriteSheet(imageChars, 64, 64);
    BearBlackSprites.define('default', 0, 3);
    BearBlackSprites.define('movingDefault', 1, 3, 1)
    BearBlackSprites.define('moving2', 1 ,3, 1)
    BearBlackSprites.define('moving3', 2, 3, 1)
    BearBlackSprites.define('moving4', 3 ,3, 1)
    BearBlackSprites.define('movingDefaultLeft', 6, 3, 2)
    BearBlackSprites.define('movingLeft2', 6 , 3, 2)
    BearBlackSprites.define('movingLeft3', 5 ,3, 2)
    BearBlackSprites.define('movingLeft4', 4 ,3, 2)
    BearBlackSprites.define('battleIdle1', 0 ,7, 3)
    BearBlackSprites.define('battleIdle2', 1 ,7, 3)
    BearBlackSprites.define('battleAttack1', 1 ,7, 4)
    BearBlackSprites.define('battleAttack2', 2 ,7, 4)
    BearBlackSprites.define('battleHurt1', 0 ,7, 5)
    BearBlackSprites.define('battleHurt2', 3 ,7, 5)

    spriteMap.set("Black", BearBlackSprites);

    


    

    

    loadImage('../assets/character.png')
    .then(image => {
    
    var tutorialBroSprites = new SpriteSheet(image, 64, 64);
    tutorialBroSprites.define("default", 0,0);
    tutorialBroSprites.define("activeDefault", 1, 0, 6);
    tutorialBroSprites.define("active2", 2, 0, 6);
    tutorialBroSprites.define("active3", 3, 0, 6);
    tutorialBroSprites.define("active4", 4, 0, 6);
    tutorialBroSprites.define("active5", 5, 0, 6);
    tutorialBro = new GameObject(tutorialBroSprites, 5, 250);
    tutorialBro.scene = 0
    tutorialBro.sprites = tutorialBroSprites;
    tutorialBro.active = true
    tutorialBro.isMoving = false
    tutorialBro.name = "Mysterious Stranger"

    var blueHairBroSprites = new SpriteSheet(image, 64, 64);
    blueHairBroSprites.define("default", 0,2);
    blueHairBroSprites.define("idle1", 1,2);
    blueHairBroSprites.define("idle2", 2,2);
    blueHairBroSprites.define("activeDefault", 1, 2, 6);
    blueHairBroSprites.define("active2", 2, 2, 6);
    blueHairBroSprites.define('battleIdle1', 3 ,2, 3)
    blueHairBroSprites.define('battleIdle2', 4 ,2, 3)
    blueHairBroSprites.define('battleAttack1', 5 ,2, 4)
    blueHairBroSprites.define('battleAttack2', 4 ,2, 4)
    blueHairBroSprites.define('battleHurt1', 6 ,2, 5)
    blueHairBroSprites.define('battleHurt2', 7 ,2, 5)
    blueHairBro = new GameObject(blueHairBroSprites, 3, 400);
    blueHairBro.sprites = blueHairBroSprites;
    blueHairBro.active = true
    blueHairBro.isMoving = false
    blueHairBro.scene = 0
    blueHairBro.name = "Lil Drewski"

    var fishBowlSprites = new SpriteSheet(image, 64, 64)
    fishBowlSprites.define("default", 0, 1);
    fishBowlSprites.define("splash1", 1, 1);
    fishBowlSprites.define("splash2", 2, 1);
    fishBowlSprites.define("splash3", 3, 1);
    fishBowlSprites.define("splash4", 4, 1);
    fishBowlSprites.define("splash5", 5, 1);
    var fishBowl = new GameObject(fishBowlSprites, 1, 500);
    fishBowl.sprites = fishBowlSprites
    fishBowl.active = true
    fishBowl.isMoving = false
    var transXY = translateCoordinates(false, 0.67, -.23, gameCanvas)
    fishBowl.posX = transXY.transX
    fishBowl.posY = transXY.transY
    fishBowl.scene = 1
    gameObjects.push(fishBowl)

    var blenderSprites = new SpriteSheet(image, 64, 64)
    blenderSprites.define("default", 0, 3);
    blenderSprites.define("idle1", 1, 3);
    blenderSprites.define("idle2", 2, 3);
    blenderSprites.define("idle3", 3, 3);
    blenderSprites.define("activeDefault", 4, 3, 6);
    blenderSprites.define("active1", 5, 3, 6);
    blenderSprites.define("active2", 6, 3, 6);
    blenderSprites.define("active3", 7, 3, 6);
    var blender = new GameObject(blenderSprites, 1, 310);
    blender.sprites = blenderSprites
    blender.active = true
    blender.name = "Fruit Blast"
    var transXY = translateCoordinates(false, -0.6, -.3, gameCanvas)
    blender.posX = transXY.transX
    blender.posY = transXY.transY
    blender.normX = -.6
    blender.normY = -.3
    blender.scene = 1
    blender.mouseActive = true
    gameObjects.push(blender)
    interactableNPCs.push(blender)

    
    gameObjects.push(tutorialBro);
    gameObjects.push(blueHairBro);
    interactableNPCs.push(tutorialBro)
    interactableNPCs.push(blueHairBro)
    
    var transXY = translateCoordinates(false, -.57, -.12, gameCanvas)
    tutorialBro.posX = transXY.transX
    tutorialBro.posY = transXY.transY
    tutorialBro.normX = -.57
    tutorialBro.normY = -.12

    var transXY = translateCoordinates(false, .3, 0, gameCanvas)
    blueHairBro.posX = transXY.transX
    blueHairBro.posY = transXY.transY
    blueHairBro.normX = .3
    blueHairBro.normY = 0
    

    
    
    loadImage('../assets/characters128.png')
    .then(image => {

        var BearRedSprites = new SpriteSheet(image, 128, 128);
        BearRedSprites.define('default', 0, 2);
        BearRedSprites.define('movingDefault', 0, 4, 1)
        BearRedSprites.define('moving2', 1 ,4, 1)
        BearRedSprites.define('moving3', 2, 4, 1)
        BearRedSprites.define('moving4', 3, 4, 1)
        BearRedSprites.define('movingDefaultLeft', 0, 3, 2)
        BearRedSprites.define('movingLeft2', 1 , 3, 2)
        BearRedSprites.define('movingLeft3', 2 ,3, 2)
        BearRedSprites.define('movingLeft4', 3 ,3, 2)
        BearRedSprites.define('battleIdle1', 0 ,5, 3)
        BearRedSprites.define('battleIdle2', 1 ,5, 3)
        BearRedSprites.define('battleIdle3', 2 ,5, 3)
        BearRedSprites.define('battleIdle4', 3 ,5, 3)
        BearRedSprites.define('battleAttack1', 0 ,6, 4)
        BearRedSprites.define('battleAttack2', 1 ,6, 4)
        BearRedSprites.define('battleAttack3', 2 ,6, 4)
        BearRedSprites.define('battleAttack3', 2 ,6, 4)
        BearRedSprites.define('battleAttack4', 2 ,6, 4)
        BearRedSprites.define('battleAttack5', 2 ,6, 4)
        BearRedSprites.define('battleAttack6', 3 ,6, 4)
        BearRedSprites.define('battleHurt1', 0 ,5, 5)
        BearRedSprites.define('battleHurt2', 1 ,5, 5)

        spriteMap.set("Red", BearRedSprites);

        player = new GameObject(BearRedSprites, 2, 150);

        dbc = new DatabaseController(gameCanvas, player, otherPlayers, gameObjects, spriteMap, accountControlModule );
        engine = new Engine(dbc, gameCanvas, player, gameObjects, interactableNPCs, dialogBox);
        controller = new Controller(gameCanvas, engine, dbc, player, msgBox, sendBtn, interactableNPCs)

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

    loadImage('../assets/store.jpg')
    .then(image => {
        requestAnimationFrame(update)
    })


    })

    

    loadImage('../assets/fruit.png')
    .then(image => {
        var bananaSprites = new SpriteSheet(image, 64, 64)
        bananaSprites.define("default", 0, 0);
        bananaSprites.define("idle1", 1, 0);
        bananaSprites.define("idle2", 2, 0);
        bananaSprites.define("idle3", 3, 0);
        var banana = new GameObject(bananaSprites, 1, 500);
        banana.sprites = bananaSprites
        var transXY = translateCoordinates(false, 0, 0, gameCanvas)
        banana.posX = transXY.transX
        banana.posY = transXY.transY
        banana.name = "banana"
        banana.scene = 101
        banana.active = false
        debugger

        var crossHairSprites = new SpriteSheet(image, 64, 64)
        crossHairSprites.define("default", 0, 1);
        crossHairSprites.define("battleIdle1", 0, 1, 3);
        crossHairSprites.define("battleAttack1", 2, 1, 4);
        crossHairSprites.define("battleAttack2", 3, 1, 4);
        crossHairSprites.define("battleAttack3", 4, 1, 4);
        crossHairSprites.define("battleAttack5", 5, 1, 4);
        crossHairSprites.define("battleAttack6", 6, 1, 4);
        crossHairSprites.define("battleAttack7", 7, 1, 4);
        crossHairSprites.define("battleAttack8", 0, 2, 4);
        crossHairSprites.define("battleAttack9", 1, 2, 4);
        crossHairSprites.define("battleAttack10", 2, 2, 4);
        crossHairSprites.define("battleAttack11", 3, 2, 4);
        crossHairSprites.define("battleAttack12", 4, 2, 4);
        var crossHair = new GameObject(crossHairSprites, 1, 100)
        var transXY = translateCoordinates(false, 0, -0.5, gameCanvas)
        banana.posX = transXY.transX
        banana.posY = transXY.transY
        crossHair.sprites = crossHairSprites
        crossHair.active = true
        crossHair.scene = 101
        crossHair.name = "cHair"
        gameObjects.push(banana)
        gameObjects.push(crossHair)

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

})






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



var next = 'default'
function update(time){

    
    display.LoadScene(player.scene)
        
    gameObjects.forEach( gameObject => 
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
            var gameScreen = gameCanvas.getBoundingClientRect(); 
            var transXY = dbc.translateCoordinates(true, gameObject.posX, gameObject.posY +gameScreen.top, gameCanvas)
            
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

          
          
            var timeElapsed = time - gameObject.moveStart
            
            var tempX = gameObject.oldX + gameObject.speedX * timeElapsed
            var tempY = gameObject.oldY + gameObject.speedY * timeElapsed
            
            var diffX = Math.abs(tempX - gameObject.oldX);
            var diffY = Math.abs(tempY - gameObject.oldY);
            var diffSqX = diffX * diffX 
            var diffSqY = diffY * diffY 
            var totDist =  Math.sqrt( diffSqX + diffSqY)
            
            /*if(totDist >= gameObject.totalDistanceReq && gameObject.miniGameVal != 1) {
                gameObject.oldX = gameObject.posX
                gameObject.oldY = gameObject.posY
                gameObject.moveStart = -1
                gameObject.isMoving = false
                gameObject.isRunning = false
                gameObject.movingLeft = false
                      gameObject.movingRight = false
                return  // perhaps this return statement is causing an issue with player flicker
            }*/
            
            gameObject.posX = gameObject.oldX + gameObject.speedX * timeElapsed
            gameObject.posY = gameObject.oldY + gameObject.speedY * timeElapsed
            
            
            if (Math.abs(Math.round(gameObject.posX, 2) - Math.round(gameObject.destX, 2)) > 1 || Math.abs(Math.round(gameObject.posY, 2) - Math.round(gameObject.destY, 2)) > 1) {

            }else {
                if(gameObject.miniGameVal != 1){
                        gameObject.oldX = gameObject.posX
                    gameObject.oldY = gameObject.posY
                    gameObject.isMoving = false
                    gameObject.isRunning = false
                    gameObject.movingLeft = false
                        gameObject.movingRight = false
                    gameObject.moveStart = -1
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
