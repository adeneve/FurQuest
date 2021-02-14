import Utils from './Utils.js'

export default
class Controller{

	constructor(canvas, engine, dbc, display, player, msgBox, sendBtn, interactableNPCs){
		this.canvas = canvas
		this.engine = engine
		this.dbc = dbc
		this.msgBox = msgBox
		this.sendBtn = sendBtn
		this.GameObjInteraction = null
		this.interactionStep = 0
		this.interactableNPCs = interactableNPCs
		this.display = display

		canvas.addEventListener("mousedown", e => { 

			if(player.BlockClick) return;

			var gameScreen = canvas.getBoundingClientRect(); 
			  
			var normalized_x = ((e.clientX - gameScreen.left)-(canvas.width/2))/(canvas.width/2);
			var normalized_y = ((canvas.height/2)-(e.clientY-gameScreen.top))/(canvas.height/2);
			
			debugger;
			if(player.inMiniGame){
				engine.handleMiniGame(normalized_x, normalized_y)
				return;
			}
			if(!player.isMoving && !player.interacting && !player.fighting && !player.inMiniGame){ 
				this.interactionStep = 0
				this.GameObjInteraction = engine.checkForInteraction(normalized_x, normalized_y)
				var sceneChange = engine.checkForSceneChange(player.scene, normalized_x, normalized_y)
				if(this.GameObjInteraction == null && sceneChange == player.scene){
					if(player.scene == 0 && normalized_y > .06 && (normalized_x < .566 || normalized_x > .675)) return;
					Utils.calcMovement(e.clientX -gameScreen.left, e.clientY - gameScreen.top, player)
					engine.prepMovePlayer(normalized_x, normalized_y)
				}
				if(this.GameObjInteraction != null)
				{
					engine.handleInteraction(this.GameObjInteraction, this.interactionStep, normalized_x, normalized_y)
					this.interactionStep += 1;
					player.interacting = true
				}
				if(sceneChange != player.scene){
					player.scene = sceneChange
					engine.saveScene(sceneChange)
				}
			}
			if(player.interacting){
				engine.handleInteraction(this.GameObjInteraction, this.interactionStep, normalized_x, normalized_y)
				this.interactionStep += 1
			}
			if(player.fighting){
				engine.handleBattle( normalized_x, normalized_y)
			}
		  })

		  canvas.addEventListener("mousemove", e => {
			var gameScreen = canvas.getBoundingClientRect(); 
			  
			var normalized_x = ((e.clientX - gameScreen.left)-(canvas.width/2))/(canvas.width/2);
			var normalized_y = ((canvas.height/2)-(e.clientY-gameScreen.top))/(canvas.height/2);
			var transXY = Utils.translateCoordinates(canvas, false, normalized_x, normalized_y)
			console.log(normalized_x + " " + normalized_y);

			if(player.scene == 101){
				var cHair = 0
				this.engine.gameObjects.forEach( obj => {if(obj.name == "cHair") cHair = obj})
				cHair.posX = transXY.transX
				cHair.posY = transXY.transY
				return
			}

			if(normalized_x < .675 && normalized_x > .566 && normalized_y < 0.15 && normalized_y > -.05){
				this.display.enteringCafe = 1
			}else{
				this.display.enteringCafe = 0
			}
			

			interactableNPCs.forEach(NPC => {
                if((NPC.scene == player.scene || NPC.scene == -9) && NPC.mouseActive == true){
                    var diffX = Math.abs(normalized_x - NPC.normX)
                    var diffY = Math.abs(normalized_y - NPC.normY)
                    if(( NPC.scene != -9 && diffX < .1 && diffY < .31) || (diffX < .025 && diffY < .05)){
                        NPC.mouseAnimate = true
						if(NPC.scene == -9) NPC.interactable = true
                    }else{ 
						NPC.mouseAnimate = false
						if(NPC.scene == -9) NPC.interactable = false
                    }
				}
			})
                
            })

		  sendBtn.addEventListener("click", e => {
			  if(msgBox.value.length < 100){
				engine.saveMessage(msgBox.value)
			  }else{
				  alert("please only enter a maximum of 99 characters")
			  }
		  })

	}
}