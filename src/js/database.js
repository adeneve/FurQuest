import GameObject from "./GameObject.js";
import SpriteSheet from './SpriteSheet.js'
import Utils from "./Utils.js"
import GameObjectLoader from "./GameObjectLoader.js"

 export default 
 class DatabaseController {
    dbRef = 0
    playerDat = {}
    gameScreen = 0

    constructor(gameScreen, player, otherPlayers, localGameObjects, gameObjects, spriteMap, accountControlModule){
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
        this.localGameObjects = localGameObjects
        this.gameObjects = gameObjects
        this.spriteMap = spriteMap
        this.fbUser = -1
        this.playerCharID = -1
        this.document = document,
        this.accountControlModule = accountControlModule
        this.isLoggedIn = true
        this.isVerrified = false

        this.accountControlModule.logOutMenu.addEventListener('click', e => {
          var charDataObj = {
            active : false
          }
          this.chartactersDbRef.child(this.fbUser.uid).update(charDataObj).then(e => {
            firebase.auth().signOut().then(function() {
              alert("log out successful")
              }, function(error) {
                alert(error.message)
              });

          }).catch( e => console.log(e.message))
          
      })

         
     firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)

        const loadPlayerDat = this.loadPlayerData.bind(this)
        this.chartactersDbRef = this.dbRef.child('characters');
        

        firebase.auth().onAuthStateChanged(firebaseUser => {
            if(firebaseUser){
              console.log(firebaseUser);
              this.fbUser = firebaseUser;
              
              const charEvents = this.dbRef.child('characters').child(firebaseUser.uid);
              
              charEvents.once('value', loadPlayerDat, err => console.log("error"));
            
              const otherPlayersEvent = this.dbRef.child('characters');
              const analyzeChng = this.analyzeChange.bind(this)
              otherPlayersEvent.on('value', analyzeChng)

              this.isLoggedIn = true;
              this.isVerrified = firebaseUser.emailVerified;
              this.accountControlModule.logInMenu.style.visibility = "hidden"
              this.accountControlModule.logOutMenu.style.visibility = "visible"
              this.accountControlModule.username.innerText = firebaseUser.email
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
      
        this.playerDat = data.val()
        if(this.playerDat.message == undefined) this.playerDat.message = "";
        var charDataObj = {
          color : this.playerDat.color,
          name : this.playerDat.name,
          type : this.playerDat.type,
          x : this.playerDat.x,
          y : this.playerDat.y,
          message : this.playerDat.message,
          active : true
        }
        this.chartactersDbRef.child(this.fbUser.uid).update(charDataObj).catch( e => console.log(e.message))
        var translatedXY = Utils.translateCoordinates(this.gameScreen, false, this.playerDat.x, this.playerDat.y)
        this.playerDat.x = translatedXY.transX
        this.playerDat.y = translatedXY.transY
        this.player.posX = translatedXY.transX
        this.player.posY = translatedXY.transY
        this.player.oldX = translatedXY.transX
        this.player.oldY = translatedXY.transY
        this.player.destX = translatedXY.transX
        this.player.destY = translatedXY.transY
        this.player.normX = this.playerDat.x 
        this.player.normY = this.playerDat.y
        this.player.message = this.playerDat.message
        this.player.name = this.playerDat.name
        this.player.color = this.playerDat.color
        this.player.type = this.playerDat.type
        this.player.active = true
        this.player.sprites = this.spriteMap.get(this.player.color)
        this.player.isPlayer = true
        this.player.scene = this.playerDat.scene
        debugger;
        GameObjectLoader.LoadLocalObjects(this.player.scene, this.localGameObjects, this.gameObjects)
        this.player.playerLoaded = true
        const chkLogout = this.checkForPlayerLogout.bind(this)
        var oldNormX = this.player.normX;
        setTimeout(chkLogout, 1200000000, this.fbUser.uid, this.player, oldNormX ); 




        this.gameObjects.push(this.player)
      
      var otherPlayersEvent = this.dbRef.child('characters');
      otherPlayersEvent.once('value').then(data => {
        var charData = data.val();
        var keys = Object.keys(data.val())
        keys.forEach(key => {
          if(key != this.fbUser.uid){

            if(charData[key].active){
            
            var otherPlyerNormX = charData[key].x;
            var otherPlayerNormY = charData[key].y;
            var translatedXY = Utils.translateCoordinates(this.gameScreen, false, otherPlyerNormX, otherPlayerNormY);
            var otherPlayer = new GameObject(this.spriteMap.get(charData[key].color), 2, 500)
            otherPlayer.posX = translatedXY.transX;
            otherPlayer.posY = translatedXY.transY;
            otherPlayer.oldX = translatedXY.transX;
            otherPlayer.oldY = translatedXY.transY;
            otherPlayer.destX = translatedXY.transX;
            otherPlayer.destY = translatedXY.transY;
            otherPlayer.name = charData[key].name;
            otherPlayer.message = charData[key].message;
            otherPlayer.isOtherPlayer = true;
            otherPlayer.scene = charData[key].scene
            otherPlayer.active = charData[key].active;
            otherPlayer.color = charData[key].color;
            otherPlayer.sprites = this.spriteMap.get(otherPlayer.color);
            otherPlayer.charID = key;
            otherPlayer.isMoving = false;
            
            
              if(!this.otherPlayers.has(String(key))){
                this.gameObjects.push(otherPlayer);
                this.otherPlayers.set(String(key), otherPlayer);
                const chkLogout = this.checkForLogout.bind(this)
                var oldPosX = otherPlayer.posX;
		            setTimeout(chkLogout, 1200000000, key, otherPlayer, oldPosX );  //if other player doesn't move in 2 minutes, log them out (set active to false and push)
              }
              
            }
            
          }
        })
      })
    }

    checkForLogout(key, otherPlayer, oldPosX){
      if(oldPosX == otherPlayer.posX){
        otherPlayer.active = false;
        console.log("logging out");
        var charDataObj = {
        active : false,
        }
        const events = this.dbRef.child('characters');
        events.child(key).update(charDataObj).catch( e => console.log(e.message))
      }
    }

    checkForPlayerLogout(key, otherPlayer, oldNormX){
      if(oldNormX == otherPlayer.normX && !otherPlayer.inMiniGame){
        this.loguserOut()
      }
    }


    analyzeChange(data){
        var obj = data.val();
        var keys = Object.keys(data.val());
        keys.forEach(key => {
          if(key != this.fbUser.uid){
            if(!this.otherPlayers.has(String(key)) && obj[key].active){
              
              var otherPlyerNormX = obj[key].x;
              var otherPlayerNormY = obj[key].y;
              var translatedXY = Utils.translateCoordinates(this.gameScreen, false, otherPlyerNormX, otherPlayerNormY);
              var otherPlayer = new GameObject(this.spriteMap.get(obj[key].color), 2, 500)
              otherPlayer.posX = translatedXY.transX;
              otherPlayer.posY = translatedXY.transY;
              otherPlayer.oldX = translatedXY.transX;
              otherPlayer.oldY = translatedXY.transY;
              otherPlayer.destX = translatedXY.transX;
              otherPlayer.destY = translatedXY.transY;
              otherPlayer.name = obj[key].name;
              otherPlayer.message = obj[key].message;
              otherPlayer.scene = obj[key].scene;
              otherPlayer.color = obj[key].color;
              otherPlayer.active = true;
              otherPlayer.charID = key;
              otherPlayer.isMoving = false;
              otherPlayer.isOtherPlayer = true;
              otherPlayer.sprites = this.spriteMap.get(otherPlayer.color);
              this.gameObjects.push(otherPlayer);
              this.otherPlayers.set(String(key), otherPlayer);
              const chkLogout = this.checkForLogout.bind(this)
                var oldPosX = otherPlayer.posX;
		            setTimeout(chkLogout, 1200000000, key, otherPlayer, oldPosX ); 
            }

            if(obj[key].message == "doop"){
            }
            

            if(this.otherPlayers.has(String(key)) && !obj[key].active){
              var otherPlyer = this.otherPlayers.get(String(key))
              otherPlyer.active = obj[key].active
              this.otherPlayers.delete(String(key))
            }
          
            if(!obj[key].active) return;

            var otherPlyer = this.otherPlayers.get(String(key))
            if(otherPlyer == undefined) return;
            var transXY = Utils.translateCoordinates(this.gameScreen, false, obj[key].x, obj[key].y);

            if(!otherPlyer.isMoving){
              if(transXY.transX != otherPlyer.posX && transXY.transY != otherPlyer.posY) {
                debugger;
                otherPlyer.isMoving = true;
                otherPlyer.isRunning = true;
                Utils.calcMovement(transXY.transX, transXY.transY, otherPlyer)
              }
            }
            

            if(obj[key].message != otherPlyer.message){
              console.log(otherPlyer.name + " : " + obj[key].message)
                otherPlyer.message = obj[key].message
            }

            if(obj[key].scene != otherPlyer.scene){
                otherPlyer.scene = obj[key].scene
            }

            

          }
        })
        
    }

    savePlayerLocationDB(normX, normY){
      console.log("saving location...");
      var charDataObj = {
      x : normX,
      y : normY,
      }
      const events = this.dbRef.child('characters');
      events.child(this.fbUser.uid).update(charDataObj).catch( e => console.log(e.message))
      const chkLogout = this.checkForPlayerLogout.bind(this)
      var oldNormX = this.player.normX;
      setTimeout(chkLogout, 1200000000, this.fbUser.uid, this.player, oldNormX); 
    }

    saveMessage(msg){
      console.log("saving message...");
      console.log(msg)
      var transXY = Utils.translateCoordinates(this.gameScreen, true, this.player.destX, this.player.destY);
      var charDataObj = {
        color : this.playerDat.color,
        name : this.playerDat.name,
        type : this.playerDat.type,
        x : transXY.transX,
        y : transXY.transY,
        message : msg
      }
      this.player.message = msg
      const events = this.dbRef.child('characters');
      events.child(this.fbUser.uid).update(charDataObj).catch( e => console.log(e.message))
    }

    saveScene(scene){
      console.log("saving scene")
      var charDataObj = {
        color : this.playerDat.color,
        name : this.playerDat.name,
        type : this.playerDat.type,
        x : this.player.normX,
        y : this.player.normY,
        message : this.player.message,
        scene : scene
      }
      const events = this.dbRef.child('characters');
      events.child(this.fbUser.uid).update(charDataObj).catch( e => console.log(e.message))
    }

    loguserOut(){
      var charDataObj = {
        active : false
      }
      window.onbeforeunload = null;
      this.chartactersDbRef.child(this.fbUser.uid).update(charDataObj).then(e => {
        firebase.auth().signOut().then(function() {
          alert("log out successful");
          window.location.href = './home.html';
          }, function(error) {
            alert(error.message)
          });

      }).catch( e => console.log(e.message))
      return null;
    }

}