 export default 
 class DatabaseController {

    constructor(){
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

        firebase.auth().onAuthStateChanged(firebaseUser => {
            if(firebaseUser){
              console.log(firebaseUser);
              this.fbUser = firebaseUser;
              
              const charEvents = dbref.child('users')
              const query = charEvents
                            .orderByChild('uid')
                            .equalTo(firebaseUser.uid)
                            .limitToFirst(1);

              query.on('value', loadPlayerData, err => console.log("error"));
            
              const otherPlayersEvent = dbref.child('characters');
              otherPlayersEvent.on('value', analyzeChange)
            }
            else{
              console.log("not logged in");
              alert("please log in")
              this.fbUser = null;
            }
        })
    }

    loadPlayerData(data){
        console.log(data.val());
    }

    analyzeChange(data){
        console.log(data.val());
    }
}