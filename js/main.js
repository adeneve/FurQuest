import DatabaseController from './database.js'
import Controller from './controller.js'
import Display from './display.js'

const dbc = new DatabaseController();
var gameCanvas = document.getElementById("gameCanvas") 
const display = new Display(gameCanvas, 1024, 800)
const controller = new Controller(gameCanvas)
display.loadScene()

