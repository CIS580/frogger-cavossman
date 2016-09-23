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
