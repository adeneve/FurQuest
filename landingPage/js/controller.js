export default
class Controller{

	constructor(canvas, engine, player, msgBox, sendBtn){
		this.canvas = canvas
		this.engine = engine
		this.msgBox = msgBox
		this.sendBtn = sendBtn

		canvas.addEventListener("mousedown", e => { 

			var gameScreen = canvas.getBoundingClientRect(); 
			  
			var normalized_x = ((e.clientX - gameScreen.left)-(canvas.width/2))/(canvas.width/2);
			var normalized_y = ((canvas.height/2)-(e.clientY-gameScreen.top))/(canvas.height/2);
			
			if(!player.isMoving){
				engine.calcMovement(e.clientX -gameScreen.left, e.clientY - gameScreen.top, player)
				engine.prepMovePlayer(normalized_x, normalized_y)
			}
			
			//savePlayerLocationDB(x, y)           game engine -> database
		  })

		  sendBtn.addEventListener("click", e => {
			  engine.saveMessage(msgBox.value)
		  })
	}
}