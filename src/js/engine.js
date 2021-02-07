import GameObject from './GameObject.js'
import Utils from './Utils.js'

export default
class Engine{

	constructor(database, canvas, player, gameObjects, NPCs, dialogBox){
		this.canvas = canvas
		this.player = player
		this.db = database
		this.gameObjects = gameObjects
		this.NPCs = NPCs
		this.dialogBox = dialogBox
		this.database = database
		this.enteringCafe = 0
		this.gameScreen = canvas.getBoundingClientRect()
		this.EnemyObj = null
		this.resetBattleUI = false
		this.fightSelectUIShown = false
		this.battlePlayerTurn = 0
		this.tapout = false
		this.fightAccepted = false
		this.gameAccepted = false
	}

	prepMovePlayer(normX, normY){
		this.player.oldX = this.player.posX
		this.player.oldY = this.player.posY
		this.player.normX = normX;
		this.player.normY = normY;
		this.db.savePlayerLocationDB(normX, normY); 
		console.log("x : " + normX + "y :" + normY)
		this.player.isMoving = true
		this.player.isRunning = true
	}

	saveMessage(msg = ""){
		this.db.saveMessage(msg)
		const svmsg = this.db.saveMessage.bind(this.db)
		setTimeout(svmsg, 5000, "");
	}

	checkForInteraction(normX, normY){
		console.log("xNorm: " + normX + ", yNorm: " + normY)
		var clickedNPC = null
		this.NPCs.forEach( NPC => {
			if(NPC.interactable){ 
				var diffX = Math.abs(NPC.normX - normX)
                var diffY = Math.abs(NPC.normY - normY)
                if(diffX < .03 && diffY < .1){
					clickedNPC = NPC
				}
                
            }
		})
		return clickedNPC
	}

	handleInteraction(NPC, interactionStep, normx, normy){
		console.log('beep')
		switch(NPC.name){
			case "Mysterious Stranger":
				this.dialogBox.active = true
				this.dialogBox.name = NPC.name
				switch(interactionStep){
					case 1 :
						this.dialogBox.dialogMsg = ["hey there champ!"]
						break;
					case 2 :
						this.dialogBox.dialogMsg = ["Welcome to town, theres not much to do yet," , "but stay tuned because I hear big Drewski is coming to town"]
						break;
					case 3 :
						this.dialogBox.dialogMsg = ["See you around!"]
						break;
				} 

				if(interactionStep > 3){
					this.player.interacting = false
					this.dialogBox.active = false
				}
				break;

				case "Fruit Blast":
					this.dialogBox.active = true
					this.dialogBox.name = NPC.name
					debugger
					switch(interactionStep){
						case 1 :
							this.dialogBox.dialogMsg = ["Do you want to play Fruit Blast?", "YES                                          NO"]
							break;
						case 2 :
							if(normx < -.19 && normy < -.59) {
								this.dialogBox.active = false
								this.gameAccepted = true
								
							}else{
								this.dialogBox.active = false
								this.player.interacting = false
								this.gameAccepted = false
							}
							break;
					} 

					if(interactionStep == 2 && this.gameAccepted){
						//debugger
						this.player.scene = 101
						this.player.invisible = true
						this.player.interacting = true
						this.player.inMiniGame = true
						this.player.miniGameVal = 1
						this.player.miniGameScore = 0
						const spwnBananas = this.spawnBananas.bind(this)
						const clnFruitBlast = this.cleanFruitBlast.bind(this)
						const ctx = this.canvas.getContext('2d');
						ctx.fillStyle = "#00ff00"
						ctx.font = '50px serif';
						ctx.fillText('Score : 0', 50, 90);
						let i = 1
						for(i = 1; i < 7; i++){
							setTimeout(spwnBananas, i * 5000);
						}
						i++
						setTimeout(clnFruitBlast, i * 5000);
					}

					if(interactionStep  > 2){
						this.player.interacting = false
						this.dialogBox.active = false
					}
					break;

				case "Lil Drewski":
					this.dialogBox.active = true
					this.dialogBox.name = NPC.name
					switch(interactionStep){
						case 1 :
							this.dialogBox.dialogMsg = ["You there!"]
							break;
						case 2 :
							if(NPC.foughtBefore == undefined){
								this.dialogBox.dialogMsg = [`So, your name is ${this.player.name}.`, "You look like a real tough cookie."]
							}else{
								this.dialogBox.dialogMsg = [`Hey ${this.player.name}!`, "Good match!"]
							}
							
							break;
						case 3 :
							if(NPC.foughtBefore == undefined){
								this.dialogBox.dialogMsg = ["How about a little sparring match?", "If you win I'll buy you lunch!"]
							}else{
								this.dialogBox.dialogMsg = ["So, are you up for another round?"]
							}
							
							break;
						case 4 :
							this.dialogBox.dialogMsg = ["What do you say?", "YES                                          NO"]
							break;
						case 5 :
							if(normx < -.19 && normy < -.59) {
								this.dialogBox.dialogMsg = [`all right ${this.player.name}, show me what you got!`]
								this.fightAccepted = true
								
							}else{
								this.dialogBox.dialogMsg = ["Thats what I thought!", "It's not every day someone wants to tussle with Lil Drewski!"]
								this.fightAccepted = false
							}
							break;
						case 6 :
							debugger
							if(!this.fightAccepted) break;
							this.dialogBox.dialogMsg = [`all right ${this.player.name}, show me what you got!`]
							this.player.scene = 100
							NPC.scene = 100
							break;


					}
	
					if(interactionStep > 5 && !this.fightAccepted){
						this.player.interacting = false
						this.dialogBox.active = false
					}
					if(this.fightAccepted && interactionStep > 5){
						debugger
						this.player.interacting = false
						var trans = Utils.translateCoordinates(this.canvas, false, -.1, 0)
						this.player.normX = -.1
						this.player.normX = 0
						this.player.posX = trans.transX
						this.player.posY = trans.transY 
						this.player.fighting = true
						this.player.speed = 150
						var trans = Utils.translateCoordinates (this.canvas, false, .1, 0)
						NPC.normX = .1
						NPC.normY = 0
						NPC.posX = trans.transX
						NPC.posY = trans.transY
						NPC.fighting = true
						this.resetBattleUI = true;
						this.EnemyObj = NPC;
						this.battlePlayerTurn = Math.random()
						this.player.health = 6
						this.EnemyObj.health = 6
						this.player.defense = 0
						this.EnemyObj.defense = 0
						
					}
					break;

		}
	}


	handleBattle(normX, normY){
		if(this.tapout){
			this.player.scene = 0
			this.player.fighting = false 
			this.player.speed = 200
			var trans = Utils.translateCoordinates (this.canvas ,false, .3, 0)
			this.EnemyObj.normX = .3
			this.EnemyObj.normY = 0
			this.EnemyObj.posX = trans.transX
			this.EnemyObj.posY = trans.transY
			this.EnemyObj.fighting = false
			this.EnemyObj.scene = 0
			this.EnemyObj.foughtBefore = true
			this.dialogBox.active = false
			var trans = Utils.translateCoordinates(this.canvas, true, this.player.oldX, this.player.oldY)
						this.player.normX = trans.transX
						this.player.normY = trans.transY
						this.player.posX = this.player.oldX
						this.player.posY = this.player.oldY
						this.tapout = false
						return
		}
		if(this.battlePlayerTurn < 0.5){
			if(this.resetBattleUI){
				this.dialogBox.dialogMsg = [ "Fight                                          Run", "", "", "Bag"]
				this.resetBattleUI = false
				return
			}
			
			if(normX < .5 && normX > -.5 && normY < -.43 && !this.fightSelectUIShown){
				if(normX > -.2 || normY < -.72){
					this.dialogBox.dialogMsg = [ "You can't do that right now!"]
					this.resetBattleUI = true;
					return
				}
				else{
					this.dialogBox.dialogMsg = [ "Attack                    Block                          Magic"]
					this.fightSelectUIShown = true
					return
				}
			
			}
	
			if(normX < .5 && normX > -.5 && normY < -.43 && this.fightSelectUIShown){
				if(this.fightSelectUIShown)
				{
					this.dialogBox.dialogMsg = [ "Attack                    Block                          Magic"]
					if(normX > 0){
						this.dialogBox.dialogMsg = [ "You have not learned about magic yet!"]
						this.resetBattleUI = true
						this.fightSelectUIShown = false
						
					}
					if(normX > -.25 && normX <= 0){
						if(this.player.defense >= 1.6){
							this.dialogBox.dialogMsg = [`${this.player.name} used block!`, `block had no effect!`]
						}else{
							this.player.defense += 0.4
							this.dialogBox.dialogMsg = [ `${this.player.name} used block!`, `${this.player.name} raised their defense!`]
						}
						this.resetBattleUI = true
						this.fightSelectUIShown = false
						this.battlePlayerTurn = 1
			            return
					}
					if(normX > -.48 && normX <= -.25){
						
						var landAttack = Math.random()

						if(landAttack > 0.2){
							var damage = (2 - this.EnemyObj.defense).toFixed(2)
							this.EnemyObj.health -= damage;
							this.EnemyObj.health = this.EnemyObj.health.toFixed(2)
							if(this.EnemyObj.health > 0.1){
								this.dialogBox.dialogMsg = [ `${this.player.name} used punch!`, `${this.EnemyObj.name} took ${damage} damage!`,
														`${this.EnemyObj.name} has ${this.EnemyObj.health} remaining!`]
							}else{
								this.dialogBox.dialogMsg = [ `${this.EnemyObj.name} tapped out!`]
								this.tapout = true
								this.resetBattleUI = true
								this.fightSelectUIShown = false
								this.EnemyObj.hurting = true
								const chgHrtSt = this.changeHurtState.bind(this)
								this.player.BlockClick = true;
								setTimeout(chgHrtSt, 1500, this.EnemyObj, false);
							}

							this.EnemyObj.hurting = true
							const chgHrtSt = this.changeHurtState.bind(this)
							this.player.BlockClick = true;
							setTimeout(chgHrtSt, 1500, this.EnemyObj, false);
						
						}else{
							this.dialogBox.dialogMsg = [ `${this.player.name} used punch!`, `but the attack missed!`]
						}
						
						this.player.attacking = true
						const chgAtkSt = this.changeAttackState.bind(this)
						this.player.BlockClick = true;
						setTimeout(chgAtkSt, 2000, this.player, false);

						this.resetBattleUI = true
						this.fightSelectUIShown = false
						this.battlePlayerTurn = 1
			            return
					}
				}
	
			}
			
		}
		else{
			var enemyMove = Math.random()
			if(enemyMove > .8){
				if(this.EnemyObj.defense >= 1.6){
					this.dialogBox.dialogMsg = [`${this.EnemyObj.name} used block!`, `block had no effect!`]
				}else{
					this.EnemyObj.defense += 0.4
				this.dialogBox.dialogMsg = [ `${this.EnemyObj.name} used block!`, `${this.EnemyObj.name} raised their defense!`]
				}
				
			}else{
				var landAttack = Math.random()
				if(landAttack > 0.2){
					var damage = (2 - this.player.defense).toFixed(2)
					this.player.health -= damage
					this.player.health = this.player.health.toFixed(2)
					if(this.player.health > 0.1){
						this.dialogBox.dialogMsg = [ `${this.EnemyObj.name} used punch!`, `${this.player.name} took ${damage} damage!`,
					                             `${this.player.name} has ${this.player.health} remaining!`]
					}else{
						this.dialogBox.dialogMsg = [ `${this.player.name} tapped out!`]
						this.tapout = true
						this.resetBattleUI = true
						this.fightSelectUIShown = false
						this.player.hurting = true
						const chgHrtSt = this.changeHurtState.bind(this)
						this.player.BlockClick = true;
						setTimeout(chgHrtSt, 1500, this.player, false);
						
					}

					this.player.hurting = true
					const chgHrtSt = this.changeHurtState.bind(this)
					this.player.BlockClick = true;
				    setTimeout(chgHrtSt, 1500, this.player, false);
				
				}else{
					this.dialogBox.dialogMsg = [ `${this.EnemyObj.name} used punch!`, `but the attack missed!`]
				}
				
				this.EnemyObj.attacking = true
				this.player.BlockClick = true;
				const chgAtkSt = this.changeAttackState.bind(this)
		        setTimeout(chgAtkSt, 2000, this.EnemyObj, false);

			}
			this.battlePlayerTurn = 0
			return
		}
		

		
	}

	spawnBananas(){
		var bananaArray = this.gameObjects.filter(obj => obj.name == 'banana')
		var bananaRef = bananaArray[0]
		for(var i = 0; i < 5; i++){
			
			var banana = new GameObject(bananaRef.sprites, 1, 500);
			banana.sprites = bananaRef.sprites
			var posNegX = Math.random();
			var initPosX = Math.random();
			if(posNegX > .5) initPosX = -initPosX
			var posNegY = Math.random();
			var initPosY = Math.random();
			if(posNegY > .5) initPosY = -initPosY
			var destNegX = Math.random();
			var initDestX = Math.random();
			if(destNegX > .5) initDestX = -initDestX
			var destNegY = Math.random();
			var initDestY = Math.random();
			if(destNegY > .5) initDestY = -initDestY
			var transXY = Utils.translateCoordinates(this.canvas, false, initPosX, initPosY, gameCanvas)
			var transXYDest = Utils.translateCoordinates(this.canvas, false, initDestX, initDestY, gameCanvas)
			banana.posX = transXY.transX
			banana.posY = transXY.transY
			banana.oldX = banana.posX 
			banana.oldY = banana.posY
			banana.destX = transXYDest.transX
			banana.destY = transXYDest.transY
			banana.name = "bananaClone" + i 
			banana.scene = 101
			banana.miniGameVal = 1
			banana.active = true
			this.gameObjects.push(banana)
			Utils.calcMovement(banana.destX, banana.destY, banana)
		}
	}

	cleanFruitBlast(){
		var i = this.gameObjects.length
		while(i--){
			if(this.gameObjects[i].name.includes('bananaClone') || this.gameObjects[i].name.includes('explosion')){
				//debugger
				this.gameObjects.splice(i, 1)
			}
		}

		this.player.scene = 1
		this.dialogBox.active = true
		this.dialogBox.dialogMsg = [`Score : ${this.player.miniGameScore}`, `the blender popped out ${(this.player.miniGameScore / 10) + 3} coins!`]
		this.player.inMiniGame = false 
		this.player.invisible = false
		this.player.miniGameVal = 0
		
	}

	handleMiniGame(normX, normY){
		if(this.player.miniGameVal == 1){  //fruit blast
			console.log("xNorm: " + normX + ", yNorm: " + normY)
			
			var crosshair = this.gameObjects.filter(obj => obj.name == "cHair")[0];
			var explosion = new GameObject(crosshair.sprites, 1, 50);
			var transXY = Utils.translateCoordinates(this.canvas, false, normX, normY, gameCanvas)
			explosion.sprites = crosshair.sprites
			debugger;
			explosion.posX = transXY.transX
			explosion.posY = transXY.transY
			explosion.oldX = explosion.posX 
			explosion.oldY = explosion.posY
			explosion.destX = explosion.posX
			explosion.destY = explosion.posY
			explosion.name = "explosionClone" + normX
			explosion.scene = 101
			explosion.miniGameVal = 1
			explosion.active = true
			explosion.attacking = true;
			explosion.fighting = true;
			this.gameObjects.push(explosion);
						const chgAtkSt = this.changeAttackState.bind(this)
						
						setTimeout(chgAtkSt, 1100, explosion, true, true);
			
				var bananaClones = this.gameObjects.filter(obj => obj.name.includes("bananaClone"))
				bananaClones.forEach( banana => {
					    var gameScreen = gameCanvas.getBoundingClientRect()
						var transXY = Utils.translateCoordinates(this.canvas, true, banana.posX, banana.posY + gameScreen.top, gameCanvas)
						banana.normX = transXY.transX
						banana.normY = transXY.transY
						var diffX = Math.abs(banana.normX - normX)
						var diffY = Math.abs(banana.normY - normY)
						if(diffX < .06 && diffY < .06){
							banana.active = false
							this.player.miniGameScore += 10
						}

				})
		}
	}

	changeAttackState(obj, val, makeInvis = false){
		obj.attacking = val
		obj.invisible = makeInvis
		this.player.BlockClick = false
		this.player.battleAttackFrameNames = this.player.spriteSheet.battleAttackTiles.keys()
	}

	changeHurtState(obj, val){
		obj.hurting = val
		this.player.BlockClick = false;
	}

	checkForSceneChange(currentScene, normX, normY){
		if(currentScene == 0){
			if(normX < .675 && normX > .566 && normY < 0.15 && normY > -.05){ 
				debugger
				var centerX = .61
				var centerY = .048
				var transXY = Utils.translateCoordinates(this.canvas, true, this.player.posX, this.player.posY + this.gameScreen.top);
				if(Math.abs(transXY.transX - centerX) < .08 && Math.abs(transXY.transY - centerY) < .25){
					var transXY = Utils.translateCoordinates(this.canvas, false, -0.16, 0.21);
					this.player.posX = transXY.transX 
					this.player.posY = transXY.transY
					this.player.oldX = this.player.posX
					this.player.oldY = this.player.posY
					this.player.destX = this.player.posX
					this.player.destY = this.player.posY
					this.player.normX = -0.16
					this.player.normY = 0.21
					console.log("saving loc in cafe")
					console.log(this.player.normX, this.player.normY)
					this.db.savePlayerLocationDB(this.player.normX, this.player.normY)
					return 1
				}else{
					return 0
				}
			}else{
				return 0
			}
		}
		if(currentScene == 1){
			if(normX < -.045 && normX > -.28 && normY < 0.57 && normY > .18){
				debugger
				console.log("leaving cafe")
				var centerX = -0.16
				var centerY = 0.21
				var transXY = Utils.translateCoordinates(this.canvas, true, this.player.posX, this.player.posY + this.gameScreen.top);
				if(Math.abs(transXY.transX - centerX) < .1 && Math.abs(transXY.transY - centerY) < .2){
					var transXY = Utils.translateCoordinates(this.canvas, false, .618, 0);
					this.player.posX = transXY.transX 
					this.player.posY = transXY.transY
					this.player.oldX = this.player.posX
					this.player.oldY = this.player.posY
					this.player.destX = this.player.posX
					this.player.destY = this.player.posY
					this.player.normX = 0.618
					this.player.normY = 0
					this.db.savePlayerLocationDB(this.player.normX, this.player.normY)
					return 0
				}else{
					return 1
				}
			}else{
				return 1
			}
		}
		else return 100
	}

	saveScene(scene){
		this.db.saveScene(scene)
	}

	drawDialog(){
		var context = this.canvas.getContext('2d')
		
			
			var transXY = Utils.translateCoordinates(this.canvas, false, -0.40, -0.6)
			var yinc = 0;
			context.font = "20px Comic Sans MS";
			context.fillStyle = "#00ff00"
			if(!this.player.fighting){
				context.fillText(this.dialogBox.name + ":", transXY.transX, transXY.transY - 30);
				this.NPCs.forEach(npc => {if(npc.name == this.dialogBox.name){
					npc.sprites.draw("default", context, transXY.transX - 25, transXY.transY, "", npc);
				}
				})
			}
			
			context.font = "15px Comic Sans MS";
			context.fillStyle = "#00ff15";
			this.dialogBox.dialogMsg.forEach(line => {
				context.fillText(line, transXY.transX, transXY.transY + yinc);
				yinc += 30;
			});            
	}
	
}