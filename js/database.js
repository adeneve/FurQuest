import GameObject from "./GameObject.js";
import SpriteSheet from './SpriteSheet.js'

 export default 
 class DatabaseController {
    dbRef = 0
    playerDat = {}
    gameScreen = 0

    constructor(gameScreen, player, otherPlayers, gameObjects, sprites){
        var firebaseConfig = {
            apiKey: "AIzaSyDGPX41BsvlB0a05akJiWTS_9yH_UZO744",
            authDomain: "furquest-1c939.firebaseapp.com",
            databaseURL: "https://furquest-1c939.firebaseio.com",
            projectId: "furquest-1c939",
            storageBucket: "furquest-1c939.appspot.com",
            messagingSenderId: "178770843812",
            appId: "1:178770843812:web:f8bf303167b573f41c6e31",
            measurementId: "G-D1DXBJLC06"
          };
          // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();
        this.dbRef = firebase.database().ref();
        this.gameScreen = gameScreen
        this.player = player
        this.otherPlayers = otherPlayers
        this.gameObjects = gameObjects
        this.sprites = sprites
        this.fbUser = -1
        this.playerCharID = -1

        const loadPlayerDat = this.loadPlayerData.bind(this)
        

        firebase.auth().onAuthStateChanged(firebaseUser => {
            if(firebaseUser){
              console.log(firebaseUser);
              this.fbUser = firebaseUser;
              
              const charEvents = this.dbRef.child('users')
              const query = charEvents
                            .orderByChild('uid')
                            .equalTo(firebaseUser.uid)
                            .limitToFirst(1);
              
              query.on('value', loadPlayerDat, err => console.log("error"));
            
              const otherPlayersEvent = this.dbRef.child('characters');
              const analyzeChng = this.analyzeChange.bind(this)
              otherPlayersEvent.on('value', analyzeChng)
            }
            else{
              console.log("not logged in");
              alert("please log in")
              window.location.href = './home.html';
              this.fbUser = null;
            }
        })
    }

    loadPlayerData(data){
      var key = Object.keys(data.val())[0]
      var charID = data.val()[key]["characters"][0]
      this.playerCharID = charID
      
      console.log("charID: " + charID)
      const events = this.dbRef.child('characters');
      const transCoord = this.translateCoordinates.bind(this)
      this.gameObjects.push(this.player)
      events.child(charID).once('value').then( charData => {
        this.playerDat = charData.val()
        var translatedXY = transCoord(false, this.playerDat.x, this.playerDat.y)
        this.playerDat.x = translatedXY.transX
        this.playerDat.y = translatedXY.transY
        this.player.posX = translatedXY.transX
        this.player.posY = translatedXY.transY
        this.player.oldX = translatedXY.transX
        this.player.oldY = translatedXY.transY
        console.log("player x: " + this.playerDat.x)
        console.log("player y: " + this.playerDat.y)
      })

      events.once('value').then(data => {
        var charData = data.val();
        var keys = Object.keys(data.val())
        keys.forEach(key => {
          if(key != charID){
            var otherPlayer = new GameObject(this.sprites, 2, 500)
            var otherPlyerNormX = charData[key].x;
            var otherPlayerNormY = charData[key].y;
            var translatedXY = transCoord(false, otherPlyerNormX, otherPlayerNormY);
            otherPlayer.posX = translatedXY.transX;
            otherPlayer.posY = translatedXY.transY;
            otherPlayer.oldX = translatedXY.transX;
            otherPlayer.oldY = translatedXY.transY;
            otherPlayer.charID = key;
            console.log(otherPlayer.posX)
            console.log(otherPlayer.posY)
            this.gameObjects.push(otherPlayer);
            this.otherPlayers.set(String(key), otherPlayer);
          }
        })
      })

    }

    // iterate through each other player and increment their position if posX != oldX
    moveOtherPlayers(time){
      console.log("here1")
      var keys = this.otherPlayers.keys();
      for(let [key, otherPlayer] of this.otherPlayers){
        console.log('boop');
        if(otherPlayer.charID != this.playerCharID){
          console.log("here1")
          if(otherPlayer.isMoving){
            
            if(otherPlayer.start == -1) {
              otherPlayer.start = time;
              otherPlayer.tempStart = time
            }

            console.log("here2")
          
          
            var timeElapsed = time - otherPlayer.start
            
            var tempX = otherPlayer.oldX + otherPlayer.speedX * timeElapsed
            var tempY = otherPlayer.oldY + otherPlayer.speedY * timeElapsed
            
            var diffX = Math.abs(tempX - otherPlayer.oldX);
            var diffY = Math.abs(tempY - otherPlayer.oldY);
            var diffSqX = diffX * diffX 
            var diffSqY = diffY * diffY 
            var totDist =  Math.sqrt( diffSqX + diffSqY)
            
            if(totDist >= otherPlayer.totalDistanceReq) {
                otherPlayer.oldX = otherPlayer.posX
                otherPlayer.oldY = otherPlayer.posY
                otherPlayer.start = -1
                otherPlayer.isMoving = false
                return
            }
            
            otherPlayer.posX = otherPlayer.oldX + otherPlayer.speedX * timeElapsed
            otherPlayer.posY = otherPlayer.oldY + otherPlayer.speedY * timeElapsed
            
            
            if (Math.abs(Math.round(otherPlayer.posX, 2) - Math.round(otherPlayer.destX, 2)) > 1 || Math.abs(Math.round(otherPlayer.posY, 2) - Math.round(otherPlayer.destY, 2)) > 1) {
              const mvOtherplayers = this.moveOtherPlayers.bind(this)
              requestAnimationFrame(mvOtherplayers)
            }else {
                otherPlayer.oldX = otherPlayer.posX
                otherPlayer.oldY = otherPlayer.posY
                otherPlayer.isMoving = false
                otherPlayer.start = -1
                return
            }

          }
        }
      }
      return;
    }

    analyzeChange(data){
        
        console.log(data.val());
        var obj = data.val();
        var keys = Object.keys(data.val())
        keys.forEach(key => {
          if(key != this.playerCharID){
            console.log(key)
            var otherPlyer = this.otherPlayers.get(String(key))
            if(otherPlyer == undefined) return;
            var transXY = this.translateCoordinates(false, obj[key].x, obj[key].y);
            //otherPlyer.posX = transXY.transX;
            //otherPlyer.posY = transXY.transY;
            console.log("other player new x: " + transXY.transX);
            console.log("other player new y: " + transXY.transY);
            
            console.log(this.otherPlayers )
            
            console.log(otherPlyer)
            
            console.log("other player old x: " + otherPlyer.posX)
            console.log("other player old y: " + otherPlyer.posY)
            if(transXY.transX != otherPlyer.posX) otherPlyer.isMoving = true;
            this.calcMovement(transXY.transX, transXY.transY, otherPlyer)

          }
        })
        const mvOtherplayers = this.moveOtherPlayers.bind(this)
        requestAnimationFrame(mvOtherplayers)
        
    }

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
      player.totalDistanceReq = totalDistancePx
    }

    translateCoordinates(toGlobal, x, y){
      var boundingRect = this.gameScreen.getBoundingClientRect();
      console.log(x);
      console.log(y);
      var transX = 0
      var transY = 0
      if(toGlobal){
        transX = ((x - boundingRect.left)-(this.gameScreen.width/2))/(this.gameScreen.width/2);
			  transY = ((this.gameScreen.height/2)-(y - boundingRect.top))/(this.gameScreen.height/2);
      }
      else{
        transX = ((this.gameScreen.width/2) * (x)) + (this.gameScreen.width/2) 
        transY = (this.gameScreen.height/2) - ((this.gameScreen.height/2) * (y))
      }
      return {transX, transY}
    }

    savePlayerLocationDB(normX, normY){
      console.log("saving location...");
      var charDataObj = {
        color : this.playerDat.color,
      name : this.playerDat.name,
      type : this.playerDat.type,
      x : normX,
      y : normY,
      }
      const events = this.dbRef.child('characters');
      events.child(this.playerCharID).update(charDataObj).catch( e => console.log(e.message))
    }

}