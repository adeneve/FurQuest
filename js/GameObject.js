export default class GameObject{

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
        this.tempTimeElapsed = -1
        this.tempStart = -1
        this.posX = 512
        this.posY = 400
        this.isMoving = false
        this.speedX = 0
        this.speedY = 0
        this.destX = -123456789
        this.destY = -123456789
        this.oldX = 512
        this.oldY = 400
        this.isMoving = false
        this.nextFrame = 0
    }

    getNextSprite(){
        this.frameNames.next().value
    }

}