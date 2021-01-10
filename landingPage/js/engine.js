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
		this.enteringCafe = 0
		this.gameScreen = canvas.getBoundingClientRect()
	}

	// returns the speedX and speedY
	calcMovement(destX, destY, player){
		player.isMoving = true
		player.destX = destX
		player.destY = destY
		var playerSpeed = .17 // .001 px per ms
		var diffX = Math.abs(destX - player.posX);
		var diffY = Math.abs(destY - player.posY);
		var diffXraw = destX - player.posX
		if(diffXraw > 0){
			this.player.movingRight = true
		}
		if(diffXraw < 0){
			this.player.movingLeft = true
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
	}

	movePlayer(time){
		if(this.player.moveStart == -1) {
			this.player.moveStart = time;
			this.player.tempStart = time
		}

		
		var timeElapsed = time - this.player.moveStart

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
			this.player.moveStart = -1
			
			this.player.isMoving = false
			this.player.isRunning = false
			this.player.movingLeft = false
			this.player.movingRight = false
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
			this.player.moveStart = -1
			debugger
			this.player.isMoving = false
			this.player.isRunning = false
			this.player.movingLeft = false
			this.player.movingRight = false
			return
		}
	}
	
	prepMovePlayer(normX, normY){
		this.player.oldX = this.player.posX
		this.player.oldY = this.player.posY
		this.db.savePlayerLocationDB(normX, normY); 
		console.log("x : " + normX + "y :" + normY)
		this.player.isMoving = true
		this.player.isRunning = true
		//const mvplayer = this.movePlayer.bind(this)
		//requestAnimationFrame(mvplayer)
	}

	saveMessage(msg = ""){
		this.db.saveMessage(msg)
		const svmsg = this.db.saveMessage.bind(this.db)
		setTimeout(svmsg, 5000, "");
	}

	translateCoordinates(toGlobal, x, y){
		var boundingRect = this.canvas.getBoundingClientRect();
		var transX = 0
		var transY = 0
		if(toGlobal){
		  transX = ((x )-(this.canvas.width/2))/(this.canvas.width/2); 
				transY = ((this.canvas.height/2)-(y - boundingRect.top))/(this.canvas.height/2);
		}
		else{
		  transX = ((this.canvas.width/2) * (x)) + (this.canvas.width/2)   
		  transY = (this.canvas.height/2) - ((this.canvas.height/2) * (y))
		}
		return {transX, transY}
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

	handleInteraction(NPC, interactionStep, normx, normy){
		console.log('beep')
		switch(NPC.name){
			case "Mysterious Stranger":
				this.dialogBox.active = true
				this.dialogBox.name = NPC.name
				switch(interactionStep){
					case 1 :
						this.dialogBox.dialogMsg = ["hey there champ!"]
						break;
					case 2 :
						this.dialogBox.dialogMsg = ["Welcome to town, theres not much to do yet," , "but stay tuned because I hear big Drewski is coming to town"]
						break;
					case 3 :
						this.dialogBox.dialogMsg = ["See you around!"]
						break;
				} //\n I hear people drop spare change when they leave the market

				if(interactionStep > 3){
					this.player.interacting = false
					this.dialogBox.active = false
				}
				break;

				case "Bobby Scar":
					this.dialogBox.active = true
					this.dialogBox.name = NPC.name
					switch(interactionStep){
						case 1 :
							this.dialogBox.dialogMsg = ["You there!"]
							break;
						case 2 :
							this.dialogBox.dialogMsg = [`So, your name is ${this.player.name}.`, "You look like a real tough cookie."]
							break;
						case 3 :
							this.dialogBox.dialogMsg = ["How about a little sparring match?", "If you win I'll buy you lunch!"]
							break;
						case 4 :
							this.dialogBox.dialogMsg = ["What do you say?", "YES                                          NO"]
							break;
						case 5 :
							debugger
							if(normx < -.19 && normy < -.65) {
								this.dialogBox.dialogMsg = [`all right ${this.player.name}, show me what you got!`]
							}else{
								this.dialogBox.dialogMsg = ["Thats what I thought!", "It's not every day someone wants to tussle with Bobby Scar!"]
							}

					} //\n I hear people drop spare change when they leave the market
	
					if(interactionStep > 5){
						this.player.interacting = false
						this.dialogBox.active = false
					}
					break;

		}
	}

	checkForSceneChange(currentScene, normX, normY){
		if(currentScene == 0){
			if(normX < .675 && normX > .566 && normY < 0.15 && normY > -.05){ 
				debugger
				var centerX = .658
				var centerY = .16
				var transXY = this.db.translateCoordinates(true, this.player.posX, this.player.posY + this.gameScreen.top);
				if(Math.abs(transXY.transX - centerX) < .05 && Math.abs(transXY.transY - centerY) < .16){
					var transXY = this.db.translateCoordinates(false, -0.16, 0.21);
					this.player.posX = transXY.transX 
					this.player.posY = transXY.transY
					this.player.oldX = this.player.posX
					this.player.oldY = this.player.posY
					this.player.destX = this.player.posX
					this.player.destY = this.player.posY
					this.player.normX = -0.16
					this.player.normY = 0.21
					console.log("saving loc in cafe")
					console.log(this.player.normX, this.player.normY)
					this.db.savePlayerLocationDB(this.player.normX, this.player.normY)
					return 1
				}else{
					return 0
				}
			}else{
				return 0
			}
		}
		if(currentScene == 1){
			if(normX < -.045 && normX > -.28 && normY < 0.57 && normY > .18){
				debugger
				console.log("leaving cafe")
				var centerX = -0.16
				var centerY = 0.21
				var transXY = this.db.translateCoordinates(true, this.player.posX, this.player.posY + this.gameScreen.top);
				if(Math.abs(transXY.transX - centerX) < .1 && Math.abs(transXY.transY - centerY) < .2){
					var transXY = this.db.translateCoordinates(false, .618, 0);
					this.player.posX = transXY.transX 
					this.player.posY = transXY.transY
					this.player.oldX = this.player.posX
					this.player.oldY = this.player.posY
					this.player.destX = this.player.posX
					this.player.destY = this.player.posY
					this.player.normX = 0.618
					this.player.normY = 0
					this.db.savePlayerLocationDB(this.player.normX, this.player.normY)
					return 0
				}else{
					return 1
				}
			}else{
				return 1
			}
		}
	}

	saveScene(scene){
		this.db.saveScene(scene)
	}

	drawDialog(){
		var context = this.canvas.getContext('2d')
		
			
			var transXY = this.database.translateCoordinates(false, -0.40, -0.6)
			var yinc = 0;
			context.font = "20px Comic Sans MS";
			context.fillStyle = "#00ff00"
			context.fillText(this.dialogBox.name + ":", transXY.transX, transXY.transY - 30);
			this.NPCs.forEach(npc => {if(npc.name == this.dialogBox.name){
				npc.sprites.draw("default", context, transXY.transX - 25, transXY.transY, "");
			}
		    })
			context.font = "15px Comic Sans MS";
			context.fillStyle = "#00ff15";
			this.dialogBox.dialogMsg.forEach(line => {
				context.fillText(line, transXY.transX, transXY.transY + yinc);
				yinc += 30;
			});            
	}
	
}