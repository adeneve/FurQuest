export default class Animator{

    animating = false
    lastUpdateTime = -1
    
    constructor(spriteSheet, animationSteps, speed){
        this.spriteSheet = spriteSheet
        this.currentStep = 0
        this.animationSteps = animationSteps
        this.speed = speed
        this.start = -1
        this.frameNames = spriteSheet.tiles.keys()
        this.animating = false
        this.lastUpdateTime = -1
        this.timeElapsed = -1
        this.posX = 16
        this.posY = 16
        this.isMoving = false
        this.speedX = .01
        this.speedY = .01
    }

    getNextSprite(){
        this.frameNames.next().value
    }

}