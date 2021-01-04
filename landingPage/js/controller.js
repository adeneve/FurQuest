export default
class Controller{

	constructor(canvas, engine, player, msgBox, sendBtn){
		this.canvas = canvas
		this.engine = engine
		this.msgBox = msgBox
		this.sendBtn = sendBtn
		this.GameObjInteraction = null
		this.interactionStep = 0

		canvas.addEventListener("mousedown", e => { 

			var gameScreen = canvas.getBoundingClientRect(); 
			  
			var normalized_x = ((e.clientX - gameScreen.left)-(canvas.width/2))/(canvas.width/2);
			var normalized_y = ((canvas.height/2)-(e.clientY-gameScreen.top))/(canvas.height/2);
			
			
			
			if(!player.isMoving && !player.interacting){
				this.interactionStep = 0
				this.GameObjInteraction = engine.checkForInteraction(normalized_x, normalized_y)
				var sceneChange = engine.checkForSceneChange(player.scene, normalized_x, normalized_y)
				if(this.GameObjInteraction == null && sceneChange == player.scene){
					if(player.scene == 0 && normalized_y > .06 && (normalized_x < .566 || normalized_x > .675)) return;
					engine.calcMovement(e.clientX -gameScreen.left, e.clientY - gameScreen.top, player)
					engine.prepMovePlayer(normalized_x, normalized_y)
				}
				if(this.GameObjInteraction != null)
				{
					engine.handleInteraction(this.GameObjInteraction, this.interactionStep)
					this.interactionStep += 1;
					player.interacting = true
				}
				if(sceneChange != player.scene){
					console.log("entering cafe1") // push scene change to db
					player.scene = sceneChange
					engine.saveScene(sceneChange)
				}
			}
			if(player.interacting){
				engine.handleInteraction(this.GameObjInteraction, this.interactionStep)
				this.interactionStep += 1
			}

			
			//savePlayerLocationDB(x, y)           game engine -> database
		  })

		  canvas.addEventListener("mousemove", e => {
			var gameScreen = canvas.getBoundingClientRect(); 
			  
			var normalized_x = ((e.clientX - gameScreen.left)-(canvas.width/2))/(canvas.width/2);
			var normalized_y = ((canvas.height/2)-(e.clientY-gameScreen.top))/(canvas.height/2);
			console.log(normalized_x + " " + normalized_y);

			if(normalized_x < .675 && normalized_x > .566 && normalized_y < 0.15 && normalized_y > -.05){
				//console.log("entering cafe")
				engine.enteringCafe = 1
			}else{
				engine.enteringCafe = 0
			}
		  })

		  sendBtn.addEventListener("click", e => {
			  engine.saveMessage(msgBox.value)
		  })
	}
}