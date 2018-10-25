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
	this.sprite = 'images/char-boy.png';
}

// The player class requires an update(), and a render() method.

// The update method makes the player move when input is received
Player.prototype.update = function() {

	//update position
	if (this.keyPress === 'left') {
		this.x -= 50;
	}
	else if (this.keyPress === 'right') {
		this.x += 50;
	}
	if (this.keyPress === 'up') {
		this.y -= 50;
	}
	else if (this.keyPress === 'down') {
		this.y += 50;
	}
	this.keyPress = null;

	//set axis boundaries 
	if (this.x < 0) {
		this.x = 0;
	} else if (this.x > 400) {
		this.x = 400;
	}
	else if (this.y > 400) {
		this.y = 400;
	}
	//reset position if the player reaches the water
	else if (this.y < 5) {
		this.x = 200;
		this.y = 400;	
	}
}

Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(e) {
	this.keyPress = e;
};

// Now instantiate the objects.
// An array called allEnemies holds the enemies
var allEnemies = [];
// A variable called player holds the player object
var player = new Player();


// This listens for key presses and sends the keys to the Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//set enemies with an immediately-invoked function
(function instantiateEnemies() {
	allEnemies = [];
	allEnemies.push(new Enemy(-100, 60));
	allEnemies.push(new Enemy(-200, 145));
	allEnemies.push(new Enemy(-300, 225));
	// the next two enemies are on the first and last lane. There is only one enemy in the middle lane.
	allEnemies.push(new Enemy(-600, 60));
	allEnemies.push(new Enemy(-600, 225));
})();