export default
class Display{

	constructor(canvas, player){
        this.gameCanvas = canvas
        this.player = player
    }

    SetScreenDimensions(widthPx, heightPx){
        this.gameCanvas.width = widthPx
        this.gameCanvas.height = heightPx
    }

    PrepareScenes(){
        this.scene = new Image();
        this.scene.src = '../assets/town1200.png'
        this.sceneOpenCafe = new Image();
        this.sceneOpenCafe.src = '../assets/town1200openCafe.png'
        this.sceneCafe = new Image();
        this.sceneCafe.src = '../assets/cafe.png'
        this.fruitBlastScene = new Image();
        this.fruitBlastScene.src = '../assets/fruitBlast.png'
    }

    
    LoadScene(scene){

        switch(scene){
            case 0: 
              this.gameCanvas.getContext('2d').drawImage(this.scene, 0, 0, this.scene.width, this.scene.height, 0, 0, this.gameCanvas.width, this.gameCanvas.height);
              break;
            case 1: 
              this.gameCanvas.getContext('2d').drawImage(this.sceneCafe, 0, 0, this.sceneCafe.width, this.sceneCafe.height, 0, 0, this.gameCanvas.width, this.gameCanvas.height);
              break
            case 100:
                this.gameCanvas.getContext('2d').drawImage(this.scene, 0, 0, this.scene.width, this.scene.height, 0, 0, this.gameCanvas.width, this.gameCanvas.height); 
                break
            case 101:
                this.gameCanvas.getContext('2d').drawImage(this.fruitBlastScene, 0, 0, this.fruitBlastScene.width,  this.fruitBlastScene.height, 0, 0, this.gameCanvas.width, this.gameCanvas.height);
                const ctx = this.gameCanvas.getContext('2d');
                ctx.fillStyle = "#00ff00"
                ctx.font = '50px serif';
                ctx.fillText(`Score : ${this.player.miniGameScore}`, 50, 90);
                break
            default:
                break;
                
        }
    }

    LoadGameObjects(gameObjects){
        
    }
}