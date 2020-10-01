import DatabaseController from './database.js'
import Controller from './controller.js'
import Display from './display.js'
import SpriteSheet from './SpriteSheet.js'
import Animator from './Animator.js'
import Engine from './engine.js'
import {loadImage} from './loaders.js'

const dbc = new DatabaseController();
var gameCanvas = document.getElementById("gameCanvas") 
const display = new Display(gameCanvas, 1024, 800) 
var controller = 0;
var engine = 0;
display.loadScene()
var animators = []
var sprites = -1
var scene = new Image();
scene.src = '../assets/library.png'



loadImage('../assets/tiles.png')
.then(image => {
    sprites = new SpriteSheet(image);
    sprites.define('ground', 0, 0);
    sprites.define('sky', 3, 23);
    sprites.draw('ground', gameCanvas.getContext('2d'), 512, 400)
    var animator = new Animator(sprites, 2, 500)
    engine = new Engine(gameCanvas, animator);
    controller = new Controller(gameCanvas, engine, animator)
    animators.push(animator)
    requestAnimationFrame(update)
});

var next = 'ground'
function update(time){
        
    animators.forEach( animator => 
        {
            if(animator.tempStart == -1) animator.tempStart = time

        animator.tempTimeElapsed = time - animator.tempStart
        
        
        if(animator.tempTimeElapsed >= animator.speed){
            animator.currentStep += 1
            next = animator.frameNames.next().value

            if(next == undefined) {
                animator.frameNames = animator.spriteSheet.tiles.keys()
                next = 'ground'

            }else{
                //console.log(next)
                animator.tempStart = time
            }
            
        }

        gameCanvas.getContext('2d').drawImage(scene, 0, 0);
        sprites.draw(next, gameCanvas.getContext('2d'), animator.posX, animator.posY)
    }
    )

requestAnimationFrame(update)
}



