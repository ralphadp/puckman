window.addEventListener('load',init,false);
var canvas=null;
var context=null;
var PLAYERESTEP=10;
var Key=0;
var player_puck=new Player(20,200,45,46);

var img = new Image();
img.src = 'pacmanright.jpg';

img.onload = function () {
	player_puck.source = img;
}
 
function init(){
 canvas=document.getElementById('maze');
 canvas.style.background='#000';
 context=canvas.getContext('2d');
 loop(context);
}

function loop(){
 setTimeout(loop, 1000 / 60);
 game();
 paint(context);
}

function game(){
  // Change punk direction
  if(Key==38)
    player_puck.y-=PLAYERESTEP;
  if(Key==40)
    player_puck.y+=PLAYERESTEP;
  if(Key==39)
    player_puck.x+=PLAYERESTEP;
  if(Key==37)
    player_puck.x-=PLAYERESTEP;

  if(player_puck.y+45>=canvas.height)
	  player_puck.y=canvas.height-45;
  if(player_puck.y<=0)
	  player_puck.y=0;file:///home/puckman/puckman.htm
  if(player_puck.x+45>=canvas.width)
	  player_puck.x=canvas.width-45;
  if(player_puck.x<=0)
	  player_puck.x=0;
//  Key=0;
}

function paint(ctx){
 //if(Key == 38 || Key ==40){
	 ctx.clearRect(0,0,canvas.width,canvas.height);
	
	 ctx.fillStyle='#fff';
	 if (player_puck.source != null)
		 ctx.drawImage(player_puck.source, player_puck.current * player_puck.width, 0, player_puck.width, player_puck.height, player_puck.x, player_puck.y, player_puck.width, player_puck.height);
	 player_puck.current = (player_puck.current + 1) % player_puck.totalFrames;
	 ctx.fillText('Player score '+player_puck.score.toString(),400,10);
 //	}
}

function random(max){
 return parseInt(Math.random()*max);
}

function playerMovement(evt){
   Key=evt.keyCode;
}

function playerPause(evt){
   Key=0;	
}

document.addEventListener('keydown',playerMovement,true);
document.addEventListener('keyup',playerPause,true);

function Player(x,y,width,height){
 this.source=null;
 this.current=0;
 this.totalFrames=11;
 this.score=0;
 this.x=(x==null)?0:x;
 this.y=(y==null)?0:y;
 this.width=(width==null)?0:width;
 this.height=(height==null)?this.width:height;

 this.collition=function(object){
  if(object!=null){
   return(this.x<object.x+object.width&&
    this.x+this.width>object.x&&
    this.y<object.y+object.height&&
    this.y+this.height>object.y);
  }
 }


}
