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
var animator = 0
var start = -1



loadImage('../assets/tiles.png')
.then(image => {
    const sprites = new SpriteSheet(image);
    sprites.define('ground', 0, 0);
    sprites.define('sky', 3, 23);
    sprites.draw('ground', gameCanvas.getContext('2d'), 16, 16)
    animator = new Animator(sprites, 2, 1000)
    requestAnimationFrame(update)
});

function update(time){
    //console.log('beep')
   // console.log(animator)
    //console.log(animator.lastUpdateTime)
        if (animator.lastUpdateTime == -1){
            console.log('boop')
            animator.lastUdateTime = time
          }
          //console.log("time: " + time)
          
          
          const elapsed = time - animator.lastUpdateTime;
          //console.log(elapsed)

          if(elapsed >= animator.speed){
              console.log("hi")
              animator.currentStep += 1
              var next = animator.frameNames.next().value
              console.log(next)
              if(next == undefined) animator.frameNames = animator.spriteSheet.tiles.keys()
              animator.lastUdateTime = time
          }
        requestAnimationFrame(update)
}