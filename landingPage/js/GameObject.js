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
        this.currentFrame = ""
        this.animating = false
        this.lastUpdateTime = -1
        this.timeElapsed = -1
        this.tempTimeElapsed = -1
        this.tempStart = -1
        this.posX = 512
        this.posY = 400
        this.normX = 0
        this.normY = 0
        this.isMoving = false
        this.active = false
        this.speedX = 0
        this.speedY = 0
        this.destX = 512
        this.destY = 400
        this.oldX = 512
        this.oldY = 400
        this.isMoving = false
        this.nextFrame = "default"
        this.totalDistanceReq = 0
        this.charID = -1
        this.message = ""
        this.name = ""
        this.isPlayer = false
    }

    getNextSprite(){
        this.frameNames.next().value
    }

}