export default
class Display{

	constructor(canvas, width, height){
        this.gameCanvas = canvas
		this.gameCanvas.width = width
        this.gameCanvas.height = height
    }
    
    loadScene(){
        var scene = new Image();
        scene.src = '../assets/town.png'

        //drawing of the test image - img1
        scene.onload = function () {
            var canvas = document.getElementById('gameCanvas');
            //draw background image
            gameCanvas.getContext('2d').drawImage(scene, 0, 0);
            //draw a box over the top
            //ctx.fillStyle = "rgba(200, 0, 0, 0.5)";
            //ctx.fillRect(0, 0, 500, 500);

        };
    }
}