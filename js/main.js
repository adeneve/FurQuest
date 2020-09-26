import DatabaseController from './database.js'
import Controller from './controller.js'
import Display from './display.js'
import SpriteSheet from './SpriteSheet.js'
import {loadImage} from './loaders.js'

const dbc = new DatabaseController();
var gameCanvas = document.getElementById("gameCanvas") 
const display = new Display(gameCanvas, 1024, 800) 
const controller = new Controller(gameCanvas)
display.loadScene()


loadImage('../assets/tiles.png')
.then(image => {
    const sprites = new SpriteSheet(image);
    sprites.define('ground', 0, 0);
    sprites.define('sky', 3, 23);
    sprites.draw('ground', gameCanvas.getContext('2d'), 16, 16)
});
