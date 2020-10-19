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
              otherPlayersEvent.on('value', this.analyzeChange)
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
            console.log(otherPlayer.posX)
            console.log(otherPlayer.posY)
            this.gameObjects.push(otherPlayer);
          }
        })
      })

    }

    analyzeChange(data){
        console.log(data.val());
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