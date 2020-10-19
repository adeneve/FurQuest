export default
class Engine{

	constructor(database, canvas, player){
		this.canvas = canvas
		this.player = player
		this.db = database
	}

	// returns the speedX and speedY
	calcMovement(destX, destY, player){
		player.isMoving = true
		player.destX = destX
		player.destY = destY
		var playerSpeed = .15 // .001 px per ms
		var diffX = Math.abs(destX - player.posX);
		var diffY = Math.abs(destY - player.posY);
		var diffTot = diffX + diffY 
		var percentX = diffX / diffTot
		var percentY = diffY / diffTot 
		player.speedX = playerSpeed * percentX
		player.speedY = playerSpeed * percentY
		console.log("---------")
		console.log(player.oldX);
		console.log(player.destX);
		console.log(player.oldY);
		console.log(player.destY);
		if(destX < player.oldX) player.speedX *= -1
		if(destY < player.oldY) player.speedY *= -1
		console.log(player.speedX);
		console.log(player.speedY)
		var diffSqX = diffX * diffX 
		var diffSqY = diffY * diffY 
		var totalDistancePx = Math.sqrt( diffSqX + diffSqY)
	}

	movePlayer(time){
		if(this.player.start == -1) {
			this.player.start = time;
			this.player.tempStart = time
		}

		var timeElapsed = time - this.player.start
	
		this.player.posX = this.player.oldX + this.player.speedX * timeElapsed
		this.player.posY = this.player.oldY + this.player.speedY * timeElapsed
		
	
		if (Math.abs(Math.round(this.player.posX, 2) - Math.round(this.player.destX, 2)) > 1 || Math.abs(Math.round(this.player.posY, 2) - Math.round(this.player.destY, 2)) > 1) {
			const mvplayer = this.movePlayer.bind(this)
			requestAnimationFrame(mvplayer)
		}else {
			this.player.oldX = this.player.posX
			this.player.oldY = this.player.posY
			this.player.start = -1
			return
		}
	}
	
	prepMovePlayer(normX, normY){
		this.player.oldX = this.player.posX
		this.player.oldY = this.player.posY
		this.db.savePlayerLocationDB(normX, normY); 
		const mvplayer = this.movePlayer.bind(this)
		requestAnimationFrame(mvplayer)
	}
	
}