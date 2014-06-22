var Random = new function() {
	
	this.seed = 10;
	
	this.value = function(seed) {
	    if (seed != null) {
			this.seed = seed;
		}
        return parseInt(Math.random() * this.seed);
    }
};

var game = new Game();

function init() {
	if (game.init()) {
		game.start();
    }
}

var Repository = new function() {

    this.background = new Image();
	this.pacmanRight = new Image();
    this.pacmanLeft = new Image();
    this.pacmanDown = new Image();
    this.pacmanUp = new Image();

	var numImages = 5;
	var numLoaded = 0;

	function imageLoaded() {
		numLoaded++;
		if (numLoaded === numImages) {
			window.init();
		}
	}
	
	this.background.onload = function() {
		imageLoaded();
	};

	this.pacmanRight.onload = function () {
		imageLoaded();
	};

    this.pacmanLeft.onload = function () {
        imageLoaded();
    };

    this.pacmanDown.onload = function () {
        imageLoaded();
    };

    this.pacmanUp.onload = function () {
        imageLoaded();
    };
	
	this.background.src = "puckmaze.png";
	this.pacmanRight.src = 'pacmanright.png';
    this.pacmanLeft.src = 'pacmanleft.png';
    this.pacmanUp.src = 'pacmanup.png';
    this.pacmanDown.src = 'pacmandown.png';
};

function Background(x, y , width, height) {

    Drawable.call(this, x, y, width, height);
	
	this.draw = function() {
		this.context.drawImage(Repository.background, this.x, this.y);
	};
}
Background.prototype = new Drawable();
 
function Game () { 
	this.init = function() {
  
        this.bgCanvas = document.getElementById('background');
		this.canvas = document.getElementById('puck');

		if (this.canvas.getContext) {
			this.context = this.canvas.getContext('2d');
			this.bgContext = this.bgCanvas.getContext('2d');

			Background.prototype.context = this.bgContext;
			Background.prototype.canvasWidth = this.bgCanvas.width;
			Background.prototype.canvasHeight = this.bgCanvas.height;
			this.background = new Background(0, 0, 900, 700);

            this.maze = new GameMap();
			Player.prototype.context = this.context;
			Player.prototype.canvasWidth = this.canvas.width;
			Player.prototype.canvasHeight = this.canvas.height;
			this.player_puck = new Player(200, 0, 45, 46, this.maze);

			return true;
		}
		return false;
	};
	
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

function Player(x, y, width, height, maze) {
    this.current = 0;
    this.totalFrames = 11;
    this.PLAYERESTEP = 10;
    this.score = 0;
    this.maze = maze;
    this.currentPacman = Repository.pacmanRight;

    Drawable.call(this, x, y, width, height);

	this.draw = function() {
	    this.context.fillStyle = '#fff';

        if (KEY_STATUS.left) {
            if (Repository.pacmanLeft != null) {
                this.currentPacman = Repository.pacmanLeft;
            }
        } else if (KEY_STATUS.right) {
            if (Repository.pacmanRight != null) {
                this.currentPacman = Repository.pacmanRight;
            }
        } else if (KEY_STATUS.up) {
            if (Repository.pacmanUp != null) {
                this.currentPacman = Repository.pacmanUp;
            }
        } else if (KEY_STATUS.down) {
            if (Repository.pacmanDown != null) {
                this.currentPacman = Repository.pacmanDown;
            }
        }
        this.context.drawImage(this.currentPacman, this.current * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height);
        this.current = (this.current + 1) % this.totalFrames;
	};
	
	this.move = function() {
		if (KEY_STATUS.right || KEY_STATUS.left || KEY_STATUS.down || KEY_STATUS.up ) {
			// The puck-man moved, so erase it's current image so it can
			// be redrawn in it's new location
			this.context.clearRect(this.x, this.y, this.width, this.height);
			
	        if (KEY_STATUS.left) {
				this.x -= this.PLAYERESTEP;
                if (!this.maze.isVerticalWall(this.x, this.y, this.height, 0)) {
                    this.x += this.PLAYERESTEP;
                }
			}
			if (KEY_STATUS.right) {
				this.x += this.PLAYERESTEP;
                if (!this.maze.isVerticalWall(this.x + this.width, this.y, this.height, 0)) {
                    this.x -= this.PLAYERESTEP;
                }
			}
			if (KEY_STATUS.up) {
				this.y -= this.PLAYERESTEP;
                if (!this.maze.isVerticalWall(this.x, this.y, 0, this.width)) {
                    this.y += this.PLAYERESTEP;
                }
			}
			if (KEY_STATUS.down) {
				this.y += this.PLAYERESTEP;
                if (!this.maze.isVerticalWall(this.x, this.y + this.height, 0, this.width)) {
                    this.y -= this.PLAYERESTEP;
                }
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
	};

	this.collition = function(object) {
		if (object != null) {
			return (this.x < object.x + object.width &&
			this.x + this.width > object.x &&
			this.y < object.y + object.height &&
			this.y + this.height > object.y);
		}
        return false;
	}
}
Player.prototype = new Drawable();

function GameMap() {
    this.division = 50;
    this.mazeMap = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0],
                    [0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0],
                    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
                    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
                    [0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0],
                    [0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0],
                    [0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0],
                    [0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0],
                    [0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0],
                    [0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0],
                    [0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0],
                    [0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0],
                    [0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

    /**
     * Gets the sector Y where the player object is located.
     * @param y
     * @returns {number}
     */
    this.sectorY = function (y) {
        var sector = 0;
        for(var index = -this.division; index < this.division * this.mazeMap.length ; index += this.division) {
            if (y >= index && y < index + this.division) {
                return sector;
            }
            sector++;
        }
        return -1;
    };

    /**
     * Gets the sector X where the player object is located.
     * @param x
     * @returns {number}
     */
    this.sectorX = function(x) {
        var sector = 0;
        for(var index = 0; index < this.division * this.mazeMap[0].length; index += this.division) {
            if (x >= index && x < index + this.division) {
                return sector;
            }
            sector++;
        }
        return -1;
    };

    /**
     * Check if the player object should move or not.
     * @param x
     * @param y
     * @returns {boolean}
     */
    this.isWall = function (x, y) {
        this.row = this.sectorY (y);
        this.column = this.sectorX (x);

        var valid = this.mazeMap[this.row][this.column];

        return (valid == 1);
    }

    /**
     *
     * @param x
     * @param y
     * @param height
     * @param weight
     * @returns {boolean}
     */
    this.isVerticalWall = function (x, y, height, width) {
        this.row = this.sectorY (y);
        this.column = this.sectorX (x);

        var valid = this.mazeMap[this.row][this.column];
        if (valid == 1) {
            var row = this.sectorY (y + height);
            var column = this.sectorX (x + width);
            return (this.mazeMap[row][column] == 1);
        }

        return (valid == 1);
    }
}

function animate() {
	requestAnimFrame( animate );
	game.paint();
	game.background.draw();
	game.player_puck.move();
	game.player_puck.draw();
}
