
# Classic Arcade Game Clone

## Table of Contents

* [Instructions](#instructions)
* [Issues](#issues)
* [Contributing](#contributing)


## Instructions

This project is built using the starter code provided to Udacity students. To complete this project, I wrote object-oriented functions, such as class functions (Player, Enemy, and Collectable) and class prototype functions (for example Player.prototype.checkCollision), and used the keyword 'this' within my class and class prototype functions to refer to the object the function is called upon.

To run the game simply open index.html in your browser.

This is a frogger game where the player must cross the road and avoid colliding with enemies. The game can be played indefinitely or until the player loses all lives.
The player cannot move off screen. When the player successfully crosses the road, their position is reset. Upon colliding with enemies, the player's position is also reset and the player loses one life.

There are 3 lanes where enemies spawn, the first and last lane have two enemies each, while the middle lane only has one enemy.

The player's character is animated and moves smoothly. When pressing and holding down two keys, the second key will have priority and the character will move in that direction.

The panel displays the number of lives left, the score, a timer, and a reset button.

The lives or hearts displayed on the screen represent (3) extra lives. Upon losing these three lives, the player still has one more life. The player can replenish lives by picking up collectable hearts. These hearts spawn randomly after the player has lost one life and there are none on the canvas.

When the player loses all lives, the game is over. A modal pops up displaying the score and the time elapsed (stored in the timer), and asks the player if they wish to play again. When the game is over, all enemies and collectables are removed from the game and will not spawn until the player restarts the game. If the player closes the modal, they cannot raise their score or pick up items (no items will spawn). However, they can use the restart button to restart the game.

The displayed timer starts when the user presses a key. When the game is over (the player has lost all lives), the timer stops.

The score keeps track of how many times the player has crossed the road unharmed.

The reset button allows the user to reset the game, the timer, the score, and the player's lives. Enemies will respawn with random speeds.

My inspiration source for the fox character: http://king-hime.tumblr.com/post/161131875868/some-game-sprites-i-did-for-a-customer-this-was

Dependencies include:
https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css
https://fonts.googleapis.com/css?family=Coda


## Issues

The player has a total of 4 lives. Only 3 are displayed on the screen (they are extra lives). For this reason I had to use the number 3 and drop to -1 instead of 0 to display the hearts.

I have had to use the same image twice for the 4-frame animation. This is not very efficient and takes up space, however, I could not find any other solution as of now.

When simultaneously holding down the keys up and down, or right or left, the character will move according to the last pressed key. However, I feel the player should not move at all in these circumstances. I have had issues with the movement not being smooth enough, with a delayed movement when first starting to move, or upon changing direction, but I have successfully fixed it after multiple attempts and now the movement is very smooth.

When picking up a heart from above, you have to get a lot closer. I have shrunk both the player and the hearts so that might be the cause. From all other angles it makes better contact.

The player might be too fast, but that is easily adjustable.
Perhaps the player should stop moving when their position is reset. This would prevent accidentally running back into enemies. I have seen a model of pixel collision but chose not to implement it because I felt the box model was sufficient.


## Contributing

This repository is my personal project for the FEND program at Udacity. Therefore, I most likely will not accept pull requests.
Project completed in May 2018.