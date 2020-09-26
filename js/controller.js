export default
class Controller{

	constructor(canvas){
		this.canvas = canvas

		canvas.addEventListener("mousedown", e => { 

			var gameScreen = e.target.getBoundingClientRect(); 
			  
			var normalized_x = ((e.clientX - gameScreen.left)-(canvas.width/2))/(canvas.width/2);
			var normalized_y = ((canvas.height/2)-(e.clientY-gameScreen.top))/(canvas.height/2);
			console.log("pressed")
			
			//movePlayer(e.clientX, e.clientY)   game engine
			//savePlayerLocationDB(x, y)           game engine -> database
		  })
	}
}