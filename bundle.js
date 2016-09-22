(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: 240})

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
function update(elapsedTime) {
  player.update(elapsedTime);
  // TODO: Update the game objects
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.render(elapsedTime, ctx);
}

},{"./game.js":2,"./player.js":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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
  this.spritesheet.src = encodeURI('assets/PlayerSprite1.png');
  this.timer = 0;
  this.frame = 0;
  this.locked = 0;

  this.animation = 0;

  var self = this;
  window.onkeydown = function (event) {
      switch (event.keyCode) {
          case 38:
          case 87://up
              if (self.y > 15 && (self.state == "idle" || self.sate == "break")) self.y -= 25
              break;
          case 40:
          case 83://down
              if (self.y < 350 && (self.state == "idle" || self.sate == "break")) self.y += 25;
              break;
          case 39:
          case 68://right
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

Player.prototype.lock = function(){
	this.state = "locked";
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
                    this.frame = 3;
                    this.animation++;//adding pause to blinking
                    if (this.animation > 20) {
                        this.frame = 0;
                        this.animation = 0;
                    }
                }
            }
            break;
            // TODO: Implement your player's update by state
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
                        this.state = "break";
                    case 3:
                        this.y += 10;
                        break;
                }
            }
            break;
        case "break"://used to avoid fast jump
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
		case "locked":
			if  (this.locked > 10){
				this.y = 230;
				this.x = 0;
				this.state = "idle";
				this.locked = 0;
			}
			if (this.timer > MS_PER_FRAME) {
                this.timer = 0;
				this.locked++;
                this.frame += 1;
                if (this.frame > 3) {
                    this.frame = 3;
                    this.animation++;//adding pause to blinking
                    if (this.animation > 20) {
                        this.frame = 0;
                        this.animation = 0;
                    }
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
      // TODO: Implement your player's redering according to state
      case "idle":
      case "break":
      case "won":
	  case "locked":
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
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
