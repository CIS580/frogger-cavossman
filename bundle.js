(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

const MS_PER_FRAME = 1000/8;

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Log = require('./log.js');
const Car = require('./car.js');

/* Global variables */

var canvas = document.getElementById('screen');
var background = new Image();
background.src = './assets/background.png';
var game = new Game(canvas, update, render);
var game = new Game(canvas, update, render);
var player = new Player({ x: 0, y: 230 })
var car = [ new Car({x: 384, y: 300, direction: 1}), new Car({x: 384, y: 140, direction: 1}), new Car({ x: 384, y: -10, direction: 1 }), new Car({ x: 384, y: -350, direction: 1 }),
            new Car({x: 448, y: 660, direction: 0}), new Car({x: 448, y: 110, direction: 0}),
            new Car({x: 576, y: -200, direction: 0}), new Car({x: 576, y: -400, direction: 0}), new Car({x: 576, y: 230, direction: 0}),
			new Car({x: 640, y: 660, direction: 0}), new Car({x: 640, y: 110, direction: 0})];

var log = [ new Log({x: 69, y: 100, direction: 0}), new Log({x: 69, y: 300, direction: 0}), new Log({x: 69, y: -150, direction: 0}), new Log({x: 69, y: -520, direction: 0}), 
            new Log({x: 192, y: 680, direction: 1}), new Log({x: 192, y: 420, direction: 1}), new Log({x: 192, y: 160, direction: 1}), new Log({x: 192, y: -120, direction: 1}),
            new Log({x: 256, y: 420, direction: 0}), new Log({x: 256, y: 160, direction: 0}), new Log({x: 256, y: -120, direction: 0}), new Log({x: 256, y: -420, direction: 0})];
var timer = 1000 / 8;
var totalScore = 0;
var level = 1;
var lives = 3;
var logCheck = false;
var gameState = "start";
var forFlash = true;
var timer = 0;



window.onkeyup = function (event) {
      switch (event.keyCode) {
          case 13:
			switch(gameState){
				case "lose":
				case "win":
					lives = 3;
					totalScore = 0;
					level = 1;
					player.reset();
					for (i = 0; i < car.length; i++) {
						car[i].resetSpeed();
					}
					for (i = 0; i < log.length; i++) {
						log[i].resetSpeed();
					}
				case "start":
					gameState = "running";
			}
			break;
		case 27:
			if(gameState == "running"){
				lives = 3;
				totalScore = 0;
				level = 1;
				player.reset();
				gameState = "start";
				for (i = 0; i < car.length; i++) {
					car[i].resetSpeed();
				}
				for (i = 0; i < log.length; i++) {
					log[i].resetSpeed();
				}
			}
			break;
      }
  }


/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime, ctx) {
	switch(gameState){
		case "start":
			
			break;
		case "running":
		
			// WINNING CASES
			if(player.getState() == "won"){
				switch(level){
					case 5:
						totalScore += 500 * lives;
						gameState = "win";
					case 4:
						totalScore += 400;
					case 3:
						totalScore += 300;
					case 2:
						totalScore += 200;
					case 1:
						totalScore += 100;
					level++;
					for (i = 0; i < car.length; i++) {
						car[i].upSpeed();
					}
					for (i = 0; i < log.length; i++) {
						log[i].upSpeed();
					}
				}
			}
			
			// DEATH CASES
			if(player.getState() != "dead") {
				switch(player.x){
					case 64:
						if(player.getState() != "lock") {
							logCheck = false;
							for(i = 0; i < 4;i++){ 
								if(player.y + 54 > log[i].y && player.y < log[i].y + 50 && log[i].getState() == "float"){
									logCheck = true;
								}
							}
							if(!logCheck || player.y < -10){
								player.kill();
								lives--;
							}
						}
						player.y -= log[0].getSpeed();
						break;
					case  192:
						if(player.getState() != "lock") {
							logCheck = false;
							for(i = 4; i < 8;i++){ 
								if(player.y+54 > log[i].y && player.y < log[i].y + 50 && log[i].getState() == "float"){
									logCheck = true;
								}
							}
							if(!logCheck || player.y > 400){
								player.kill();
								lives--;
							}
						}
						player.y += log[0].getSpeed();
						break;
					case 256:
						if(player.getState() != "lock") {
							logCheck = false;
							for(i = 8; i < 12;i++){ 
								if(player.y+54 > log[i].y && player.y < log[i].y + 50 && log[i].getState() == "float"){
									logCheck = true;
								}
							}
							if(!logCheck || player.y < -10){
								player.kill();
								lives--;
							}
						}
						player.y -= log[0].getSpeed();
						break;
					case 384:
						for(i = 0; i < 4 ; i++){
							if(player.y + 54 > car[i].y && player.y < car[i].y + 100){
								player.kill();
								lives--;
							}
						}
						break;
					case 448:
						for(i = 4; i < 6;i++){
							if(player.y + 54 > car[i].y && player.y < car[i].y + 100){
								player.kill();
								lives--;
							}
						}
						break;
					case 576:
						for(i = 6; i < 9;i++){
							if(player.y + 54 > car[i].y && player.y < car[i].y + 100){
								player.kill();
								lives--;
							}
						}
						break;
					case 640:
						for(i = 9; i < 11;i++){
							if(player.y + 54 > car[i].y && player.y < car[i].y + 100){
								player.kill();
								lives--;
							}
						}
						break;
				}
				if(lives < 1)gameState = "lose";
			}
			else{
				switch(player.x){
					case 64:
						player.y -= log[0].getSpeed();
						break;
					case 192:
						player.y += log[0].getSpeed();
						break;
					case 256:
						player.y -= log[0].getSpeed();
						break;
				}
			}
			
			player.update(elapsedTime);
			for(i = 0; i < car.length; i++){
				car[i].update(elapsedTime);
			}
			for(i = 0; i < log.length; i++){
				log[i].update(elapsedTime);
			}
			// try to add only 10 points rather than continuous points.
			if((player.x == 64 || player.x == 192 || player.x == 256 || player.x == 384 || player.x == 448 || player.x == 576 || player.x == 640) && player.getState() != "dead"){
				totalScore++;
			}
			break;
		case "win":
		
			break;
		case "lose":
		
			break;
	}
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
	switch(gameState){
		case "running":
		  ctx.drawImage(background,0,0);

		  for (i = 0; i < log.length; i++) {
			  log[i].render(elapsedTime, ctx);
		  }
		  if(player.getState() == 'dead'){
				player.render(elapsedTime, ctx);
				
				for (i = 0; i < car.length; i++) {
					car[i].render(elapsedTime, ctx, "back");
				}
		  }
		  else{
				for (i = 0; i < car.length; i++) {
					car[i].render(elapsedTime, ctx, "back");
				}
				player.render(elapsedTime, ctx);
		  }
		  for (i = 0; i < car.length; i++) {
			  car[i].render(elapsedTime, ctx, "front");
		  }
			ctx.font = "bold 14px Arial";
			ctx.fillText("Lives: ", 2, 30);
			ctx.fillText(lives, 50, 30);
			ctx.fillText("Level: ", 2, 50);
			ctx.fillText(level, 50, 50);
			ctx.fillText("Score: ", 2, 70);
			ctx.fillText(totalScore, 50, 70);
		  break;
		case "start":
			ctx.fillStyle = "#eae5e1";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = "black";
			ctx.font = "bold 100px Arial";
			ctx.fillText("FROGGER", 130, 150);
			ctx.font = "bold 30px Arial";
			ctx.fillText("Press \"enter\"!", 270, 200);
			break;
		case "win":
			ctx.fillStyle = "#eae5e1";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = "black";
			ctx.font = "bold 110px Arial";
			ctx.fillText("VICTORY", 140, 250);
			ctx.font = "bold 40px Arial";
			ctx.fillText("Score: " + totalScore, 270, 305);
			ctx.font = "bold 30px Arial";
			ctx.fillText("Press \"enter\" to play again!", 200, 400);
			for (i = 0; i < car.length; i++) {
				car[i].resetSpeed();
			}
			for (i = 0; i < log.length; i++) {
				log[i].resetSpeed();
			}
			break;
		case "lose":
			ctx.fillStyle = "#eae5e1";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = "black";
			ctx.fillStyle = "red";
			ctx.font = "bold 110px Arial";
			ctx.fillText("GAME OVER", 45, 250);
			ctx.fillStyle = "black";
			ctx.font = "bold 40px Arial";
			ctx.fillText("Score: " + totalScore, 270, 305);
			ctx.font = "bold 30px Arial";
			ctx.fillText("Press \"enter\" to try again.", 200, 400);
			for (i = 0; i < car.length; i++) {
				car[i].resetSpeed();
			}
			for (i = 0; i < log.length; i++) {
				log[i].resetSpeed();
			}
			break;
	}
}

},{"./car.js":2,"./game.js":3,"./log.js":4,"./player.js":5}],2:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000 / 8;

/**
 * @module exports the Player class
 */
module.exports = exports = Car;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Car(position) {
    this.x = position.x;
    this.y = position.y;
	this.speed = 1;
    this.direction = position.direction;
    this.width = 64;
    this.height = 128;
    this.spritesheet = new Image();
    if (this.direction == 0) this.spritesheet.src = encodeURI('assets/cars_racer.png');
    else this.spritesheet.src = encodeURI('assets/cars_racer_down.png');
    this.image = Math.floor(((Math.random() * 10000) + 1)) % 4;
}

Car.prototype.upSpeed = function(){
	this.speed++;
}

Car.prototype.resetSpeed = function(){
	this.speed = 1;
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Car.prototype.update = function (time) {
    switch (this.direction) {
        case 0:
            this.y -= this.speed;
            if (this.y < -400) {
                this.y = 680;
                Math.floor(((Math.random() * 10000) + 1)) % 4;
            }
            break
        case 1:
            this.y += this.speed;
            if (this.y > 880) {
                this.y = -200;
                this.image = Math.floor(((Math.random() * 10000) + 1)) % 4;
            }
            break;
    }

}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Car.prototype.render = function (time, ctx, part) {
    switch(part){
	case "front":
		ctx.drawImage(
			// image
			this.spritesheet,
			// source rectangle
			this.image * 390, 0, 220, 221,
			// destination rectangle
			this.x, this.y, this.width, (this.height/2)
		);
		break;
	case "back": 
		ctx.drawImage(
			// image
			this.spritesheet,
			// source rectangle
			this.image * 390, 221, 220, 221,
			// destination rectangle
			this.x, this.y+ 64, this.width, (this.height/2)
		);
	}
}

},{}],3:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],4:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000;

/**
 * @module exports the Player class
 */
module.exports = exports = Log;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Log(position) {
    this.x = position.x;
    this.y = position.y;
	this.speed = 1;
    this.direction = position.direction;
    this.width = 64;
    this.height = 126;
    this.spritesheet = new Image();
    this.spritesheet.src = encodeURI('assets/log.png');
    this.image = Math.floor(((Math.random() * 10000) + 1)) % 4;
	this.timer = 0;
	this.state = "float";
}

Log.prototype.upSpeed = function(){
	this.speed++;
}

Log.prototype.getState = function(){
	return this.state;
}

Log.prototype.getSpeed = function(){
	return this.speed;
}

Log.prototype.resetSpeed = function(){
	this.speed = 1;
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Log.prototype.update = function (time) {
    switch (this.direction) {
        case 0:
            this.y -= this.speed;
            if (this.y < -400) {
                this.y = 680;
                Math.floor(((Math.random() * 10000) + 1)) % 4;
            }
            break
        case 1:
            this.y += this.speed;
            if (this.y > 880) {
                this.y = -200;
                this.image = Math.floor(((Math.random() * 10000) + 1)) % 4;
            }
            break;
    }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Log.prototype.render = function (time, ctx) {
	if (this.state =="float") ctx.drawImage(
			// image
			this.spritesheet,
			// source rectangle
			0, 0, 64, 126,
			// destination rectangle
			this.x, this.y, this.width, this.height
		);
}

},{}],5:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/PlayerSprite0.png');
  this.timer = 0;
  this.frame = 0;
  this.lock = 0;

  var self = this;
  window.onkeydown = function (event) {
      switch (event.keyCode) {
          // UP
		  case 87, 38:
              if (self.y < 350 && (self.state == "idle" || self.sate == "wait")){
				 if (self.state == "idle") {
                  self.state = "upjump";
                  self.frame = 0;
              } 
			  } self.y -= 15;
              break;
          // DOWN
          case 83, 40:
              if (self.y < 350 && (self.state == "idle" || self.sate == "wait")){
				 if (self.state == "idle") {
                  self.state = "downjump";
                  self.frame = 0;
              } 
			  } self.y += 15;
			  
              break;
          // RIGHT
          case 68, 39:
              if (self.state == "idle") {
                  self.state = "jumping";
                  self.frame = 0;
              }
              break;
      }
  }
}

Player.prototype.getState = function(){
	return this.state;
}

Player.prototype.kill = function(){
	this.state = "dead";
}

// Prevents frog from sliding out of bounds on log.
Player.prototype.lock = function(){
	this.state = "lock";
}

Player.prototype.reset = function(){
	this.x = 0;
	this.y =230;
	this.state = "idle";
	this.frame = 0;
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
    this.timer += time;
    switch (this.state) {
        case "idle":
            if (this.timer > MS_PER_FRAME) {
                this.timer = 0;
                this.frame += 1;
                if (this.frame > 3) {
                    this.frame = 0;
                }
            }
            break;
        case "jumping":
            if (this.timer > MS_PER_FRAME/2) {
                this.timer = 0;
                this.x += 16;
                this.frame += 1;
                switch (this.frame) {
                    case 1:
                    case 2:
                        this.y -= 10;
                        break;
                    case 4:
                        this.frame = 3;
                        this.state = "wait";
                    case 3:
                        this.y += 10;
                        break;
                }
            }
            break;
        case "wait":
            if (this.timer > MS_PER_FRAME/3) {
                this.timer = 0;
                if (this.x > 700) this.state = "won";
                else this.state = "idle";
            }
            break;
        case "won":
            this.x = 0;
			this.y = 230;
			this.state = "idle";
			break;
		case "dead":
            if (this.timer > MS_PER_FRAME * 10) {
                this.timer = 0;
				this.x = 0;
				this.y = 230;
				this.state = "idle";
            }
            break;
		case "lock":
			if  (this.lock > 10){
				this.y = 230;
				this.x = 0;
				this.state = "idle";
				this.lock = 0;
			}
			if (this.timer > MS_PER_FRAME) {
                this.timer = 0;
				this.lock++;
                this.frame += 1;
                if (this.frame > 3) {
                    this.frame = 3;
                    
                }
            }
			break;
		case "downjump":
			if (this.timer > MS_PER_FRAME/2) {
                this.timer = 0;
                this.y += 8;
                this.frame += 1;
                switch (this.frame) {
                    case 1:
                    case 2:
                        this.y -= 10;
                        break;
                    case 4:
                        this.frame = 3;
                        this.state = "wait";
                    case 3:
                        this.y += 10;
                        break;
                }
            }
            break;
		case "upjump":
			if (this.timer > MS_PER_FRAME/2) {
                this.timer = 0;
                this.y -= 8;
                this.frame += 1;
                switch (this.frame) {
                    case 1:
                    case 2:
                        this.y -= 10;
                        break;
                    case 4:
                        this.frame = 3;
                        this.state = "wait";
                    case 3:
                        this.y += 10;
                        break;
                }
            }
            break;
    }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  switch(this.state) {
      case "idle":
		  ctx.drawImage(
			// image
			this.spritesheet,
			// source rectangle
			this.frame * 64, 64, this.width, this.height,
			// destination rectangle
			this.x, this.y, this.width, this.height
		  );
	  break;
      case "wait":
      case "won":
	  case "lock":
		  ctx.drawImage(
			// image
			this.spritesheet,
			// source rectangle
			this.frame * 64, 64, this.width, this.height,
			// destination rectangle
			this.x, this.y, this.width, this.height
		  );
      break;
	  case "upjump":
	  case "downjump":
      case "jumping":
          ctx.drawImage(
			// image
			this.spritesheet,
			// source rectangle
			this.frame * 64, 0, this.width, this.height,
			// destination rectangle
			this.x, this.y, this.width, this.height
		  );
      break;
	  case "dead":
        ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        0, 128, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
		);
          break;
  }
}

},{}]},{},[1]);
