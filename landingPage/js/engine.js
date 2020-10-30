export default
class Engine{

	constructor(database, canvas, player, gameObjects, NPCs, dialogBox){
		this.canvas = canvas
		this.player = player
		this.db = database
		this.gameObjects = gameObjects
		this.NPCs = NPCs
		this.dialogBox = dialogBox
		this.database = database
	}

	// returns the speedX and speedY
	calcMovement(destX, destY, player){
		player.isMoving = true
		player.destX = destX
		player.destY = destY
		var playerSpeed = .17 // .001 px per ms
		var diffX = Math.abs(destX - player.posX);
		var diffY = Math.abs(destY - player.posY);
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
	}

	movePlayer(time){
		if(this.player.start == -1) {
			this.player.start = time;
			this.player.tempStart = time
		}

		
		var timeElapsed = time - this.player.start

		var tempX = this.player.oldX + this.player.speedX * timeElapsed
		var tempY = this.player.oldY + this.player.speedY * timeElapsed

		var diffX = Math.abs(tempX - this.player.oldX);
		var diffY = Math.abs(tempY - this.player.oldY);
		var diffSqX = diffX * diffX 
		var diffSqY = diffY * diffY 
		var totDist =  Math.sqrt( diffSqX + diffSqY)

		if(totDist >= this.player.totalDistanceReq) {
			this.player.oldX = this.player.posX
			this.player.oldY = this.player.posY
			this.player.start = -1
			this.player.isMoving = false
			return
		}
	
		this.player.posX = this.player.oldX + this.player.speedX * timeElapsed
		this.player.posY = this.player.oldY + this.player.speedY * timeElapsed
		
	
		if (Math.abs(Math.round(this.player.posX, 2) - Math.round(this.player.destX, 2)) > 1 || Math.abs(Math.round(this.player.posY, 2) - Math.round(this.player.destY, 2)) > 1) {
			const mvplayer = this.movePlayer.bind(this)
			requestAnimationFrame(mvplayer)
		}else {
			this.player.oldX = this.player.posX
			this.player.oldY = this.player.posY
			this.player.start = -1
			this.player.isMoving = false
			return
		}
	}
	
	prepMovePlayer(normX, normY){
		this.player.oldX = this.player.posX
		this.player.oldY = this.player.posY
		this.db.savePlayerLocationDB(normX, normY); 
		console.log("x : " + normX + "y :" + normY)
		this.player.isMoving = true
		const mvplayer = this.movePlayer.bind(this)
		requestAnimationFrame(mvplayer)
	}

	saveMessage(msg){
		this.db.saveMessage(msg)
	}

	checkForInteraction(normX, normY){
		console.log("xNorm: " + normX + ", yNorm: " + normY)
		var clickedNPC = null
		this.NPCs.forEach( NPC => {
			if(NPC.interactable){ // AND the player clicked directly on the NPC
				var diffX = Math.abs(NPC.normX - normX)
                var diffY = Math.abs(NPC.normY - normY)
                if(diffX < .03 && diffY < .1){
					clickedNPC = NPC
				}
                
            }
		})
		//did player click on that obj?
		return clickedNPC
	}

	handleInteraction(NPC, interactionStep){
		console.log('beep')
		switch(NPC.name){
			case "tBro":
				this.dialogBox.active = true
				switch(interactionStep){
					case 1 :
						this.dialogBox.dialogMsg = "hey there champ!"
						break;
					case 2 :
						this.dialogBox.dialogMsg = "Welcome to town, theres not much to do yet, \n but stay tuned because I hear big Drewski is coming to town"
						break;
					case 3 :
						this.dialogBox.dialogMsg = "Say, would you be so kind as to get me a snack from the machine over there?"
						break;
				} //\n I hear people drop spare change when they leave the market

				if(interactionStep > 3){
					this.player.interacting = false
					this.dialogBox.active = false
				}

		}
	}

	drawDialog(){
		var context = this.canvas.getContext('2d')
		context.font = "15px Comic Sans MS";
			context.fillStyle = "#00ff15";
			var transXY = this.database.translateCoordinates(false, -0.40, -0.6)
            context.fillText(this.dialogBox.dialogMsg, transXY.transX, transXY.transY)
	}
	
}