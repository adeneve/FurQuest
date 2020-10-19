 export default 
 class DatabaseController {
    dbRef = 0
    playerDat = {}
    gameScreen = 0

    constructor(gameScreen, player, otherPlayers, gameObjects){
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
        console.log(this.playerDat.x)
        console.log(this.playerDat.y)

      })
    }

    analyzeChange(data){
        console.log(data.val());
    }

    translateCoordinates(toGlobal, x, y){
      var viewport = this.gameScreen.getBoundingClientRect();
      console.log(x);
      console.log(y);
      var transX = 0
      var transY = 0
      if(toGlobal){
        transX = ((x - this.gameScreen.left)-(this.canvas.width/2))/(this.canvas.width/2);
			  transY = ((this.canvas.height/2)-(y-this.gameScreen.top))/(this.canvas.height/2);
      }
      else{
        transX = ((this.gameScreen.width/2) * (x)) + (this.gameScreen.width/2) 
        transY = (this.gameScreen.height/2) - ((this.gameScreen.height/2) * (y))
      }
      return {transX, transY}
    }

    savePlayerLocationDB(normX, normY){
      console.log("saving location...")
    }
}