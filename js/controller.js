export default
class Controller{

	constructor(canvas){
		this.canvas = canvas

		canvas.addEventListener("mousedown", e => { 

			var gameScreen = e.target.getBoundingClientRect(); 
			  
			var normalized_x = ((x - gameScreen.left)-(canvas.width/2))/(canvas.width/2);
			var normalized_y = ((canvas.height/2)-(y-gameScreen.top))/(canvas.height/2);
			
			//movePlayer(e.clientX, e.clientY)   game engine
			//savePlayerLocationDB(x, y)           game engine -> database
		  })
	}
}