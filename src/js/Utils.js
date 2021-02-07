export default class Utils{

    static calcMovement(destX, destY, player){
		
		player.destX = destX
		player.destY = destY
		var playerSpeed = .17 // .001 px per ms
		var diffX = Math.abs(destX - player.posX);
		var diffY = Math.abs(destY - player.posY);
		var diffXraw = destX - player.posX
		if(diffXraw > 0){
			player.movingRight = true
			player.movingLeft = false
		}
		if(diffXraw < 0){
			player.movingLeft = true
			player.movingRight = false
		}
		var diffTot = diffX + diffY 
		var percentX = diffX / diffTot
		var percentY = diffY / diffTot 
		player.speedX = playerSpeed * percentX
		player.speedY = playerSpeed * percentY
		if(destX < player.oldX) player.speedX *= -1
		if(destY < player.oldY) player.speedY *= -1
		var diffSqX = diffX * diffX 
		var diffSqY = diffY * diffY 
		var totalDistancePx = Math.sqrt( diffSqX + diffSqY)
		player.totalDistanceReq = totalDistancePx
		player.isMoving = true
	}


    static translateCoordinates(gameScreen, toGlobal, x, y){
        var boundingRect = gameScreen.getBoundingClientRect();
        var transX = 0
        var transY = 0
        if(toGlobal){
          transX = ((x )-(gameScreen.width/2))/(gameScreen.width/2); 
                transY = ((gameScreen.height/2)-(y - boundingRect.top))/(gameScreen.height/2);
        }
        else{
          transX = ((gameScreen.width/2) * (x)) + (gameScreen.width/2)   
          transY = (gameScreen.height/2) - ((gameScreen.height/2) * (y))
        }
        return {transX, transY}
      }

}