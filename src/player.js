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
