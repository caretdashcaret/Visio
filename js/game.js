var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

//load wizard sprites
var wizardSprite1 = new Image();
var wizardSprite2 = new Image();
var wizardSprite3 = new Image();
var wizardSprite4 = new Image();
wizardSprite1.src = "images/wizard1.png";
wizardSprite2.src = "images/wizard2.png"; 
wizardSprite3.src = "images/wizard3.png"; 
wizardSprite4.src = "images/wizard4.png"; 
var wizardSpriteSet = [wizardSprite1,wizardSprite2,wizardSprite3,wizardSprite4];
//load intro images
var startImage = new Image();
startImage.src="images/start.png";
var introImage1 = new Image();
introImage1.src ="images/intro1.png";
var introImage2 = new Image();
introImage2.src="images/intro2.png";
var introImageSet = [introImage1, introImage2];
//load peasant images
var personSprite1 = new Image();
var personSprite2 = new Image();
var personSprite3 = new Image();
var personSprite4 = new Image();
var personSprite5 = new Image();
personSprite1.src = "images/person1.png";
personSprite2.src = "images/person2.png";
personSprite3.src = "images/person3.png";
personSprite4.src = "images/person4.png";
personSprite5.src = "images/person5.png";
var reactSprite1 = new Image();
var reactSprite2 = new Image();
var reactSprite3 = new Image();
var reactSprite4 = new Image();
var reactSprite5 = new Image();
reactSprite1.src = "images/react1.png";
reactSprite2.src = "images/react2.png";
reactSprite3.src = "images/react3.png";
reactSprite4.src = "images/react4.png";
reactSprite5.src = "images/react5.png";
var personSpriteSet=[personSprite1,personSprite2,personSprite3,personSprite4,personSprite5];
var reactSpriteSet=[reactSprite1,reactSprite2,reactSprite3,reactSprite4,reactSprite5];

var wizards = [];
var peasants = [];

var CANVAS_GROUND = 230;
var MAX_SPEED = 7;
var TOLERANCE = 30;
var SELF_TOLERANCE = 20;
var SELF_TOLERANCE_BUFF = 30;

var currentGameLoop = 0;
var FPS=30;
//for animating the intro at a slower frame rate
var introWaitTimer = 0;
var currentIntroImage = 0;
//current game score
var score = 0;
var ESCAPED_WIZARD_SCORE = -200;
var WIZARD_UNCOVERED_SCORE = 100;
var MISCLICK_SCORE = -50;

function gameInit(){
 	currentGameLoop = canvas.addEventListener('click', gameClickListener, false);
	setInterval(
		function(){
				update();
				draw();
				write();
		},
		1000/FPS
	);
}

function update() {
	
	//peasants
	peasants.forEach(function(peasant) {
		peasant.update();
	});
  	
  	peasants = peasants.filter(function(peasant) {
  		return peasant.active;
  	});
  	
  	//randomly generate peasant
  	if (Math.random() < 0.05) {
  		peasants.push(Peasant());
  	}
  	
  	
  	//wizard
  	wizards.forEach(function(wizard) {
  		wizard.update();
  	});
  	
  	wizards = wizards.filter(function(wizards) {
  		return wizards.active;
  	});
  	//randomly generate wizard
  	if (Math.random() < 0.01) {
  		wizards.push(Wizard());
  	}
}

function draw() {
	context.clearRect(0,0,canvas.width, canvas.height);
  	peasants.forEach(function(peasant) {
  		if (peasant.reaction){
  			peasant.react();
  		}
  		else {
    		peasant.draw();
  		}
  	});
  	wizards.forEach(function(wizard) {
  		if (wizard.covered) {
  			//wizard.drawCovered();
  		}
  		else {
  			wizard.drawUncovered();
  		}
  	});
}
//writes the score
function write(){
  	context.fillStyle = 'gray';
  	context.textBaseline = "bottom";
	context.fillText("Score:"+score, 900,100);
}

function Wizard(I){
	I = I || {};
	
	I.active = true;
	
	I.x = 0;
	I.y = CANVAS_GROUND;
	
	
	I.height = 50;
	I.width = 32;
	
	I.speed = Math.floor(Math.random()*MAX_SPEED) + 2;
	
	I.inBounds = function() {
		if (I.x > canvas.width) {
			score += ESCAPED_WIZARD_SCORE;
		}
		return (I.x <= canvas.width) && (I.x>=0);
	}
	
	I.covered = true;
	
	//only for debugging
	I.drawCovered = function (){
		context.fillStyle = "blue";
		context.fillRect(this.x, this.y, this.width, this.height);
	}
	
	I.spriteCounter = 0;
	I.time = 0;
	
	I.drawUncovered = function (){
		I.spriteCounter = I.spriteCounter%4;
		context.drawImage(wizardSpriteSet[I.spriteCounter], I.x, I.y);
		//context.drawImage(wizardSprite1,I.x,I.y);
	}
	
	I.update = function (){
		if (I.covered){
			I.x += I.speed;
		}
		else {
			I.x -= I.speed;
			I.time += 1;
			if (I.time%2==0){
				I.spriteCounter += 1
			}
		}
		I.active = I.active && I.inBounds();
	}
	
	return I;
}

function Peasant(I){
	I = I || {};
	
	I.active = true;
	
	I.x = 0;
	I.y = CANVAS_GROUND;
	
	I.height = 50;
	I.width = 32+Math.floor(Math.random()*52);
	
	I.selfTolerance = Math.floor(I.width/2);
	
	I.speed = Math.floor(Math.random()*MAX_SPEED)+1;
	
	I.inBounds = function() {
		return (I.x <= canvas.width);
	}
	
	I.spriteCounter = 0;
	I.time = 0;
	
	I.draw = function () {
		//context.fillStyle = "black";
		//context.strokeRect(I.x,I.y,35,35);
		//context.drawImage(wizardSprite1, I.x, I.y);
		//context.drawImage(personSprite, I.x, I.y);
		I.spriteCounter = I.spriteCounter%5;
		context.drawImage(personSpriteSet[I.spriteCounter], I.x, I.y);
	}
	
	I.react = function () {
		//context.fillStyle = "black";
		//context.fillRect(I.x,I.y,35,35);
		//context.drawImage(wizardSprite2,I.x,I.y);
		//context.drawImage(reactSprite, I.x,I.y-51);
		I.spriteCounter = I.spriteCounter%5;
		context.drawImage(reactSpriteSet[I.spriteCounter], I.x, I.y-31);
	}
	
	I.wizard = 1;
	I.wizardX = "a";
	
	I.update = function() {
		I.x += I.speed;
		I.active = I.active && I.inBounds();
		var timedReaction = false;
		var wiz = null;
		var wizX = 0;
		wizards.forEach(function(wizard) {
			//checks for an odd case of still reaction when the wizard has gone off the screen
			//happens only at the begining
			if (wizard.x > 0){				
				if (withinRange(I.x, wizard.x-I.selfTolerance, wizard.x+I.selfTolerance)) {
					timedReaction = true;
					var wiz = wizard;
					var wizX = wizard.x
				}
			}
		I.reaction = timedReaction;
		I.time += 1;
		if (I.time%10==0){
			I.spriteCounter += 1
		};
		I.wizard = wiz;
		I.wizardX = wizX;
		});
	}
	
	I.reaction = false;
	
	return I;
	
}



function gameClickListener(e) {
	var uncovered_wizard_this_click = false;
	var number_of_wizards_uncovered = 0;
	
	var coord = coordOnCanvas(e);
	var x = coord[0];
	
    wizards.forEach(function(wizard) {
    //within the toleranace
	if (withinRange(x, wizard.x-TOLERANCE, wizard.x+TOLERANCE)){
	     	wizard.covered = false;
	     	uncovered_wizard_this_click = true;
	  		number_of_wizards_uncovered += 1;
	   	}
   	});
    if (uncovered_wizard_this_click == true){
    	score += WIZARD_UNCOVERED_SCORE * number_of_wizards_uncovered;
    }
    else{
    	score += MISCLICK_SCORE;
    }
    peasants.forEach(function(peasant){
    	if (Math.abs(x-peasant.x) <= TOLERANCE){
    		console.log("peasant x");
    		console.log(peasant.time);
    		console.log(peasant.spriteCounter);
    //		console.log(peasant.x);
    //		console.log("reaction");
    //		console.log(peasant.reaction);
     	//		console.log("wizard");
     	//		console.log(peasant.wizard);
     	//		console.log("wizardX");
     	//		console.log(peasant.wizardX);
     		}
    });

}


//game intro
function gameIntro(){
	currentGameLoop = setInterval(
		function(){
			updateIntro();
			drawIntro();
		},
		1000/FPS
	);
	canvas.addEventListener("click",introClickListener,false);
}
//animates the intro
function updateIntro(){
	introWaitTimer += 1
	if ((introWaitTimer%5==0)&&(introWaitTimer>200)){
		currentIntroImage = (currentIntroImage+1)%2
	} 
}
function drawIntro(){
	context.clearRect(0,0,canvas.width, canvas.height);
	context.drawImage(introImageSet[currentIntroImage],0,0);
}
function drawStart(){
	context.clearRect(0,0,canvas.width, canvas.height);
	context.drawImage(startImage,0,0);
}
function introClickListener(e){
	var coord = coordOnCanvas(e);
	var x = coord[0];
	var y = coord[1];
	//hardcoded coords of where the start is, on canvas
	if (withinRange(x,635,740)){
		if (withinRange(y,180,240)){
			drawStart();
			unhookIntro();
			setTimeout(gameInit, 1000);
		}
	}
	
}

//changes the game loop and canvas mouse listener
function unhookIntro(){
	clearInterval(currentGameLoop);
	canvas.removeEventListener("click", introClickListener, false);
}

function withinRange(value, min, max){
	return ((value>min)&&(value<max))
}
//computes the offset to get coord on canvas
//using floor because the x offset has a 0.5, odd
function coordOnCanvas(e){
	var offset = canvas.getBoundingClientRect();
	var x = Math.floor(e.clientX - offset.left);
	var y = Math.floor(e.clientY - offset.top);
	return [x,y]
}

gameIntro();

