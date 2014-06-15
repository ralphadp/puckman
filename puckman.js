var Random = new function() {
	
	this.seed = 10;
	
	this.value = function(seed) {
	    if (seed != null) {
			this.seed = seed;
		}
        return parseInt(Math.random() * this.seed);
    }
}

var game = new Game();

function init() {
	if (game.init()) {
		game.start();
    }
}

var Repository = new function() {

	this.pacman = new Image();
	var numImages = 1;
	var numLoaded = 0;

	/*private*/
	function imageLoaded() {
		numLoaded++;
		if (numLoaded === numImages) {
			window.init();
		}
	}
	
	this.pacman.onload = function () {
		imageLoaded();
	}
	
	this.pacman.src = 'pacmanright.png';
}
 
function Game () { 
	this.init = function() {
  
		this.canvas = document.getElementById('maze');
		if (this.canvas.getContext) {
			this.canvas.style.background = '#030';
			this.context = this.canvas.getContext('2d');

			Player.prototype.context = this.context;
			Player.prototype.canvasWidth = this.canvas.width;
			Player.prototype.canvasHeight = this.canvas.height;
			this.player_puck = new Player(20, 200, 45, 46);

			return true;
		}
		return false;
	}
	
	this.start = function() {
	    this.paint();
		this.player_puck.draw();
        //call the callback-able function
		animate();
	};

	this.paint = function() {
	    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	    this.context.fillText('Player score: ' + this.player_puck.score.toString(), 400, 10);
	}
}

function Player(x, y, width, height) {
	this.source = null;
	this.current = 0;
	this.totalFrames = 11;
	this.PLAYERESTEP = 10;
	this.score = 0;
	
	Drawable.call(this, x, y, width, height);
	
	this.draw = function() {
	    this.context.fillStyle = '#fff';
		if (Repository.pacman != null) {
		    this.context.drawImage(Repository.pacman, this.current * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
		}
		this.current = (this.current + 1) % this.totalFrames;
	}
	
	this.move = function() {
		if (KEY_STATUS.right || KEY_STATUS.left || KEY_STATUS.down || KEY_STATUS.up) {
			// The ship moved, so erase it's current image so it can
			// be redrawn in it's new location
			this.context.clearRect(this.x, this.y, this.width, this.height);
			
			if (KEY_STATUS.left) {
				this.x -= this.PLAYERESTEP;
			}
			if (KEY_STATUS.right) {
				this.x += this.PLAYERESTEP;
			}
			if (KEY_STATUS.up) {
				this.y -= this.PLAYERESTEP;
			}
			if (KEY_STATUS.down) {
				this.y += this.PLAYERESTEP;
			}

			if (this.y + 45 >= this.canvasHeight) {
				this.y = this.canvasHeight - 45;
			}
			if (this.y <= 0) {
				this.y = 0;
			}
			if (this.x + 45 >= this.canvasWidth) {
				this.x = this.canvasWidth - 45;
			}
			if (this.x <= 0) {
				this.x = 0;
			}
		}
	}

	this.collition = function(object) {
		if (object != null) {
			return (this.x < object.x + object.width &&
			this.x + this.width > object.x &&
			this.y < object.y + object.height &&
			this.y + this.height > object.y);
		}
	}
}
Player.prototype = new Drawable();

function animate() {
	requestAnimFrame( animate );
	game.paint();
	game.player_puck.move();
	game.player_puck.draw();
}




