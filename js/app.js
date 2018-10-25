// Inspiration source for the fox character: http://king-hime.tumblr.com/post/161131875868/some-game-sprites-i-did-for-a-customer-this-was

// Enemies our player must avoid
var Enemy = function(x,y) {
	this.x = x;
	this.y = y;
	this.speed = Math.floor((Math.random() * 100) + 100);
	this.sprite = 'images/enemy-bug.png';
	this.width = 50;
	this.height = 50;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // All movement is multiplied by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	if(this.x <= 550) {
		this.x += this.speed * dt;
	} else {
		this.x = -100;
	}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Create the player class
var Player = function() {
	this.x = 200;
	this.y = 400;
	this.sprite = 'images/fox-';
	this.spriteIndex = 1; //integer between 1 and 4 (there are 4 animation frames)
	this.spriteIndexFloat = 1; //float, used to create the animation
	this.direction='down'; // looking down
	this.speed = 300;
	this.width = 60;
	this.height = 60;
	this.stopanimationhandler = null; //keeps track if there is a timer set to stop the animation

	//this array represents the first 128 ASCII codes (most of the usual keyboard keys). 
	//We fill the array with zeros so we can use Math.max on it. Having any undefined index will make Math.max return NaN
	this.keyMap = new Array(255).fill(0);
}


Player.prototype.animate = function(direction, dt, stop=false) {

	const animationSpeed = 10;
	const maxFrames = 4; //the animation has 4 frames, straight (legs aligned), right leg, straight, left leg, and it repeats itself

	/*we need a float number so we can control how fast the sprite index changes.
	We increment this float number by a manually tweaked animationSpeed number and 
	dt which will ensure the animation runs at the same speed for all computers.*/
	this.spriteIndexFloat = this.spriteIndexFloat+animationSpeed*dt;
	//since spriteIndex must be an integer, we round up spriteIndexFloat
	this.spriteIndex = Math.ceil(this.spriteIndexFloat);

	if (this.spriteIndex > maxFrames || direction!=this.direction || stop===true) {
		//after reaching the 4th frame, or upon changing the direction or stopping, the character reverts to the straight pose
		this.spriteIndex = 1;
		this.spriteIndexFloat = 1;
	}

	//cancel the stop animation timer, since we are currently moving
	clearInterval(this.stopanimationhandler);
	this.stopanimationhandler = null;

	//change the direction only if it's a valid one. When the movement is stopped we get the null direction
	if (direction!=null) {
		this.direction=direction;
	}
}


// The player class requires an update(), and a render() method.

// The update method makes the player move when input is received
Player.prototype.update = function(dt) {

	const max = Math.max(...this.keyMap); // this selects the highest value from the keyMap, that is, the key last pressed

	//if a key was pressed then max would be higher than zero
	if (max > 0) {

		if (this.keyMap[37] === max) {
			this.x -= this.speed * dt;
			this.animate('left', dt);
		}
		else if (this.keyMap[39] === max) {
			this.x += this.speed * dt;
			this.animate('right', dt);
		}
		else if (this.keyMap[38] === max) {
			this.y -= this.speed * dt;
			this.animate('up', dt);
		}
		else if (this.keyMap[40] === max) {
			this.y += this.speed * dt;
			this.animate('down', dt);
		}
	}
	else
	{
		//no key is currently pressed so we try to stop any running animation
		if (this.stopanimationhandler == null) {
			this.stopanimationhandler = setTimeout(function() {player.animate(null, 0, true);},200);		
		}
	}

	//set axis boundaries 
	if (this.x < 0) {
		this.x = 0;
	} else if (this.x > 400) {
		this.x = 400;
	}
	else if (this.y > 400) {
		this.y = 400;
	}
	//reset position if the player reaches the water, unless the game is over
	else if (this.y < 5) {
		//increment the score counter (as long as the game isn't over) and display it on the page
		if (lives > -1) {
			this.x = 200;
			this.y = 400;
			(function incrementCounter() {
				score++;
				counter.textContent = 'Score: ' + score;
			})();
		}
		else {
			this.y = 0;
		}	
	}

	//check for enemy collision
	player.checkCollision();

	// pick up collectable items
	player.pickUpCollectables();
}


// This method checks whether the player has collided with an enemy.
Player.prototype.checkCollision = function() {
	allEnemies.forEach(function(enemy) {
		var collision = hitBox(player, enemy);
		if (collision === true) {
			player.x = 200;
			player.y = 400;

			//upon colliding, you lose one life/heart
			(function subtractHearts(){
				if (lives > 0) {
					lives--;
					drawLives();
				}
				else {
					lives = -1;
					(function gameOver() {

						// clear enemies
						allEnemies = [];

						//clear collectables
						allCollectables = [];

						//stop the timer
						clearInterval(myInterval);

						//display the end screen modal showing the score
						const endScreen = document.querySelector(".end-screen");
						endScreen.style.visibility = "visible";
						const message = document.querySelector(".message");
						message.innerHTML = "Game Over";
						const highscore = document.querySelector(".end-score");
						highscore.innerHTML = "You've reached the score of " + score +" in " +  timer.innerText + " minutes.";

						//pressing play again restarts the game
						const playButton = document.querySelector(".play-again");
						playButton.onclick = function() {
							endScreen.style.visibility = "hidden";
							restartGame();
						}

						//when the user clicks on (x), close the modal
						const closeButton = document.querySelector(".close");
						closeButton.onclick = function() {
							endScreen.style.visibility = "hidden";
						}
					})();
				}
			})();
		}
	});
}

// Render the player. This method uses the sprite name, direction, and index to coin the name of the png file to be rendered
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite+this.direction+this.spriteIndex+'.png'), this.x, this.y, 105, 170);
};

Player.prototype.handleInput = function(e) {
	this.keyPress = e;
};

// Now instantiate the objects.
// An array called allEnemies holds the enemies
var allEnemies = [];
// A variable called player holds the player object
var player = new Player();


// This listens for key presses. I used 'keydown' for continuous movement
document.addEventListener('keydown', function(e) {
	var max = Math.max(...player.keyMap); // this selects the highest value from the keyMap. The key pressed last will have the highest value
	player.keyMap[e.keyCode] = max + 1; // the last key you press has priority. Its value is incremented by one, thus having the highest value.
});

// This listens for released keys. It stops the player from moving when the key is released, i.e. on 'keyup'. Without it, the player would not stop moving.
document.addEventListener('keyup', function(e) {
	player.keyMap[e.keyCode] = 0; // When a key is released its value is set to 0
});

function startTimer() {

	//prevent more instances of the timer from running
	document.removeEventListener('keydown', startTimer);

	myInterval = setInterval(function(){
		//increment the number every second
		sec++;
		//calculate the seconds and minutes and convert them to strings
		const minutes = Math.floor(sec/60).toString();
		const seconds = Math.floor(sec%60).toString();
		//display the timer in double digits
		timer.innerText = minutes.padStart(2, "0") + ":" + seconds.padStart(2, "0");
	}, 1000);
}


//count the moves starting from 0
const counter = document.querySelector(".score");
let score = 0;

const heart = document.querySelectorAll(".fa-heart");
const max_lives = 3; // There are technically 4 lives. Upon losing the three lives/hearts displayed on the screen, the player still has one more life. That is the case because the three lives are extra lives that can be replenished.
let lives;

//display the remaining lives
function drawLives() {
	for (var i = 0; i < max_lives; i++) {
		if (i < lives) {
			heart[i].style.visibility="visible";
		}
		else {
			heart[i].style.visibility="hidden";
		}
	}
}

//the restart button resets the score, hearts, timer
const restartButton = document.querySelector(".restart");
restartButton.addEventListener("click", restartGame);

// the timer displays the seconds and minutes that have passed
const timer = document.querySelector(".timer");
timer.innerText = "00:00";
let sec = 0;
//define the variable so clearInterval can be called outside of the startTimer function
let myInterval;


//(re)start the game
function restartGame() {

	setTimeout (function() {
		//re(set) the score counter
		counter.textContent = 'Score: 0';
		score = 0;

		//re(set) the hearts
		heart[2].style.visibility="visible";
		heart[1].style.visibility="visible";
		heart[0].style.visibility="visible";
		lives = max_lives;

		//re(set) the timer
		sec = 0;
		timer.innerText = "00:00";
		clearInterval(myInterval);

		//reset the player's position
		player.x = 200;
		player.y = 400;

		//re(set) enemies with an immediately-invoked function
		(function instantiateEnemies() {
			allEnemies = [];
			allEnemies.push(new Enemy(-100, 60));
			allEnemies.push(new Enemy(-200, 145));
			allEnemies.push(new Enemy(-300, 225));
			// the next two enemies are on the first and last lane. There is only one enemy in the middle lane.
			allEnemies.push(new Enemy(-600, 60));
			allEnemies.push(new Enemy(-600, 225));
		})();

	//spawn collectables
	setTimeout(instantiateCollectables, 5000);
	// 5000 = Initial timer responsible for spawning collectables when the page is first loaded
	}, 100);

	//start the timer upon the first move
	document.addEventListener('keydown', startTimer);
}

//start the game
restartGame();


// store collectables in an array
let allCollectables = [];

var Collectable = function(x, y) {
	this.x = x;
	this.y = y;
	this.width = 40;
	this.height = 50;
	this.visible = true;
	this.sprite = 'images/heart.png';
	this.fixedY = y; // this will make the heart bounce vertically
}

function instantiateCollectables() {
	if (allCollectables.length === 0 && lives > -1 && lives < max_lives) {

		//generate a collectable heart at a random position, on the conditions stipulated above, i.e. that there are none present on the canvas, the player is not at full health, and the game is not over
		var collectable = null;
		do {
			function getRandomNumber(min, max) { return Math.floor(Math.random() * (max - min)) + min; }
			var random_column = getRandomNumber(40, 11) * 10;
			var random_row = getRandomNumber(40, 11) * 10;
			var collectable = new Collectable(random_row, random_column);
		} while (hitBox(player, collectable)===true) // the heart will not spawn in the same position as the player

		allCollectables.push(collectable);
	}

	// run this function continuously to check if we need to spawn lives
	var rand = Math.floor(Math.random() * 10000 + 4000);
	setTimeout(instantiateCollectables, rand); // set a timeout before exiting the instantiateCollectables function so the function will run repeatedly
}

Collectable.prototype.render = function() {
	if (this.visible === true) {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 60,90);
	}
}

// this method makes the collectable bounce up and down
Collectable.prototype.update = function(dt) {
	this.y = this.fixedY + (Math.sin(Date.now()/250)*10);
};


//pick up collectable items
Player.prototype.pickUpCollectables = function() {

	allCollectables.forEach(function(collectable) {
		var collision =	hitBox(player, collectable);
		//picking up a heart replenishes one life
		if (collision === true) {
			(function addHearts() {
				if (lives < max_lives) {
					lives++;
					drawLives();
					// the collectable is removed
					collectable.visible = false;
					allCollectables.length = 0;
				}
			})();
		}
	});
}


/* Box model detection, return true on collision */
//source: https://benjaminhorn.io/code/pixel-accurate-collision-detection-with-javascript-and-canvas/
function hitBox( source, target ) {
	return !(
		( ( source.y + source.height ) < ( target.y ) ) ||
		( source.y > ( target.y + target.height ) ) ||
		( ( source.x + source.width ) < target.x ) ||
		( source.x > ( target.x + target.width ) )
	);
};