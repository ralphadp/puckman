/**
 * Created by ralph on 05-04-14.
 */
/**
 * Creates the Drawable object which will be the base class for
 * all drawable objects in the game. Sets up default variables
 * that all child objects will inherit, as well as the default
 * functions.
 */
function Drawable(x, y, width, height) {
    
	// Default variables
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
    
	this.init = function(canvasWidth, canvasHeight) {
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
	}
	
	this.setSpeed = function (speed) {
	    this.speed = speed;
	}

    // Define abstract function to be implemented in child objects
    this.draw = function() {
    };

    this.move = function() {
    };
}
