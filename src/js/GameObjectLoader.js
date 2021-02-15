import SpriteSheet from "./SpriteSheet.js"
import Utils from "./Utils.js"
import GameObject from "./GameObject.js"
import {loadImage} from './loaders.js'

export default class GameObjectLoader{


    static Initialize(gameObjects, localGameObjects, interactableNPCs, spriteMap){
        var tutorialBro;
        var blueHairBro;
        var fountain;
        var player;
        var dialogBox;

        return new Promise(function(resolve, reject) {
            
          

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
            var transXY = Utils.translateCoordinates(gameCanvas, false, 0.67, -.23)
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
            var transXY = Utils.translateCoordinates(gameCanvas, false, -0.6, -.3)
            blender.posX = transXY.transX
            blender.posY = transXY.transY
            blender.normX = -.6
            blender.normY = -.3
            blender.scene = 1
            blender.mouseActive = true
            gameObjects.push(blender)
            interactableNPCs.push(blender)


            var inventoryIconSprites = new SpriteSheet(image, 64, 64)
            inventoryIconSprites.define("default", 0, 4);
            inventoryIconSprites.define("idle1", 0, 4);
            inventoryIconSprites.define("activeDefault", 1, 4, 6);
            inventoryIconSprites.define("active1", 1, 4, 6);
            var inventoryIcon = new GameObject(inventoryIconSprites, 1, 20);
            inventoryIcon.sprites = inventoryIconSprites
            inventoryIcon.active = true
            inventoryIcon.name = "Inventory"
            var transXY = Utils.translateCoordinates(gameCanvas, false, 0.75, -.93)
            inventoryIcon.posX = transXY.transX
            inventoryIcon.posY = transXY.transY
            inventoryIcon.normX = .75
            inventoryIcon.normY = -.93
            inventoryIcon.scene = -9
            inventoryIcon.mouseActive = true
            gameObjects.push(inventoryIcon)
            interactableNPCs.push(inventoryIcon)

            var accountStatsIconSprites = new SpriteSheet(image, 64, 64)
            accountStatsIconSprites.define("default", 2, 4);
            accountStatsIconSprites.define("idle1", 2, 4);
            accountStatsIconSprites.define("activeDefault", 3, 4, 6);
            accountStatsIconSprites.define("active1", 3, 4, 6);
            var accountStats = new GameObject(accountStatsIconSprites, 1, 20);
            accountStats.sprites = accountStatsIconSprites
            accountStats.active = true
            accountStats.name = "accountIcon"
            var transXY = Utils.translateCoordinates(gameCanvas, false, 0.68, -.93)
            accountStats.posX = transXY.transX
            accountStats.posY = transXY.transY
            accountStats.normX = .68
            accountStats.normY = -.93
            accountStats.scene = -9
            accountStats.mouseActive = true
            gameObjects.push(accountStats)
            interactableNPCs.push(accountStats)

            var phoneIconSprites = new SpriteSheet(image, 64, 64)
            phoneIconSprites.define("default", 4, 4);
            phoneIconSprites.define("idle1", 4, 4);
            phoneIconSprites.define("activeDefault", 5, 4, 6);
            phoneIconSprites.define("active1", 5, 4, 6);
            var phoneIcon = new GameObject(phoneIconSprites, 1, 20);
            phoneIcon.sprites = phoneIconSprites
            phoneIcon.active = true
            phoneIcon.name = "phoneIcon"
            var transXY = Utils.translateCoordinates(gameCanvas, false, 0.82, -.93)
            phoneIcon.posX = transXY.transX
            phoneIcon.posY = transXY.transY
            phoneIcon.normX = .82
            phoneIcon.normY = -.93
            phoneIcon.scene = -9
            phoneIcon.mouseActive = true
            gameObjects.push(phoneIcon)
            interactableNPCs.push(phoneIcon)

            var InventoryBoxSprites = new SpriteSheet(image, 64, 64)
            InventoryBoxSprites.define("default", 0, 5);
            InventoryBoxSprites.define("idle1", 0, 5);
            InventoryBoxSprites.define("activeDefault", 0, 5, 6);
            InventoryBoxSprites.define("active1", 0, 5, 6);
            var InventoryBox = new GameObject(InventoryBoxSprites, 1, 20);
            InventoryBox.sprites = InventoryBoxSprites
            InventoryBox.active = true
            InventoryBox.name = "InventoryBox"
            var transXY = Utils.translateCoordinates(gameCanvas, false, 0.38, -0.47)
            InventoryBox.posX = transXY.transX
            InventoryBox.posY = transXY.transY
            InventoryBox.normX = .7
            InventoryBox.normY = -.85
            InventoryBox.scene = -9
            InventoryBox.interactable = false
            InventoryBox.invisible = true
            InventoryBox.doScale = true
            InventoryBox.scale = 8
            gameObjects.push(InventoryBox)

            var coinSprites = new SpriteSheet(image, 64, 64)
            coinSprites.define("default", 1, 5);
            coinSprites.define("idle1", 1, 5);
            coinSprites.define("activeDefault", 1, 5, 6);
            coinSprites.define("active1", 1, 5, 6);
            var coin = new GameObject(coinSprites, 1, 20);
            coin.sprites = coinSprites
            coin.active = true
            coin.name = "coin"
            var transXY = Utils.translateCoordinates(gameCanvas, false, 0.681, -0.51)
            coin.posX = transXY.transX
            coin.posY = transXY.transY
            coin.normX = .681
            coin.normY = -.51
            coin.scene = -9
            coin.interactable = true
            coin.invisible = true
            gameObjects.push(coin)
            interactableNPCs.push(coin)


            
            gameObjects.push(tutorialBro);
            gameObjects.push(blueHairBro);
            interactableNPCs.push(tutorialBro)
            interactableNPCs.push(blueHairBro)
            
            var transXY = Utils.translateCoordinates(gameCanvas, false, -.57, -.12)
            tutorialBro.posX = transXY.transX
            tutorialBro.posY = transXY.transY
            tutorialBro.normX = -.57
            tutorialBro.normY = -.12

            var transXY = Utils.translateCoordinates(gameCanvas, false, .3, 0)
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
                player.isPlayer = true;
                gameObjects.push(player)
                

        

        loadImage('../assets/dialogBox.png')
    .then(image => {
    var dialogBoxSprites = new SpriteSheet(image, 610, 260)
    dialogBoxSprites.define("default", 0, 0);
    dialogBox = new GameObject(dialogBoxSprites, 1, 500);
    dialogBox.sprites = dialogBoxSprites
    dialogBox.active = false
    var transXY = Utils.translateCoordinates(gameCanvas, false, 0, -.8)
    dialogBox.posX = transXY.transX
    dialogBox.posY = transXY.transY
    dialogBox.name = "dialogBox"
    resolve({player, dialogBox});
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
        var transXY = Utils.translateCoordinates(gameCanvas, false, 0, 0)
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
        var transXY = Utils.translateCoordinates(gameCanvas, false, 0, -0.5)
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
            fountain = new GameObject(fountainSprites, 1, 240);
            fountain.sprites = fountainSprites
            fountain.active = true
            fountain.isMoving = false
            var transXY = Utils.translateCoordinates(gameCanvas, false, -0.4, -.3)
            fountain.posX = transXY.transX
            fountain.posY = transXY.transY
            fountain.scene = 0
            gameObjects.push(fountain)
        })

      });
    }

    static LoadLocalObjects(scene, localGameObjects, gameObjects){
        localGameObjects.splice(0, localGameObjects.length)
        gameObjects.forEach(obj => {
            if(obj.scene == scene || obj.isPlayer || obj.scene == -9){
                if(obj.scene != -9){
                    obj.invisible = false
                }
                localGameObjects.push(obj)
            }
        
        });
    }



}