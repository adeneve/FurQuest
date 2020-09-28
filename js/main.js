import DatabaseController from './database.js'
import Controller from './controller.js'
import Display from './display.js'
import SpriteSheet from './SpriteSheet.js'
import Animator from './Animator.js'
import {loadImage} from './loaders.js'

const dbc = new DatabaseController();
var gameCanvas = document.getElementById("gameCanvas") 
const display = new Display(gameCanvas, 1024, 800) 
const controller = new Controller(gameCanvas)
display.loadScene()
var animators = []
var start = -1
var sprites = -1
var scene = new Image();
scene.src = '../assets/library.png'



loadImage('../assets/tiles.png')
.then(image => {
    sprites = new SpriteSheet(image);
    sprites.define('ground', 0, 0);
    sprites.define('sky', 3, 23);
    sprites.draw('ground', gameCanvas.getContext('2d'), 16, 16)
    var testAnimator = new Animator(sprites, 2, 300)
    animators.push(testAnimator)
    requestAnimationFrame(update)
});

function update(time){
        
          

    animators.forEach( animator => 
        {
        if(animator.lastUpdateTime == -1) animator.lastUpdateTime = time;
        animator.timeElapsed = time - animator.lastUpdateTime
        var dx = animator.posX + animator.speedX * animator.timeElapsed
        var dy = animator.posY + animator.speedY * animator.timeElapsed
        gameCanvas.getContext('2d').drawImage(scene, 0, 0);
              sprites.draw('ground', gameCanvas.getContext('2d'), dx, dy)
        if(animator.timeElapsed >= animator.speed){
            animator.currentStep += 1
            var next = animator.frameNames.next().value
            
            if(next == undefined) {
                animator.frameNames = animator.spriteSheet.tiles.keys()

            }else{
                
                console.log(next)
              //animator.lastUpdateTime = time  change to lastFrameUpdateTime
            }
            
        }
    }
    )

requestAnimationFrame(update)
}


function handleAnimators(time, animators){
    animators.forEach( animator => 
        {
        var elapsed = time - animator.lastUpdateTime
        if(elapsed >= animator.speed){
            animator.currentStep += 1
            var next = animator.frameNames.next().value
            
            if(next == undefined) {
                animator.frameNames = animator.spriteSheet.tiles.keys()
            }else{
                console.log(next)
              sprites.draw(next, gameCanvas.getContext('2d'), 16, 16)
              animator.lastUpdateTime = time
            }
            
        }
    }
    );
}