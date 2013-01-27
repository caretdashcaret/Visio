var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

//load sprites
var wizardSprite = new Image();
//wizardSprite.src = "images/wizardwalk.png";
wizardSprite.src="images/wizard1.png";
var wizardSprite1 = new Image();
var wizardSprite2 = new Image();
var wizardSprite3 = new Image();
var wizardSprite4 = new Image();
wizardSprite1.src = "images/wizard1.png";
wizardSprite2.src = "images/wizard2.png"; 
wizardSprite3.src = "images/wizard3.png"; 
wizardSprite4.src = "images/wizard4.png"; 
var wizardSpriteSet = [wizardSprite1,wizardSprite2,wizardSprite3,wizardSprite4];
var startImage = new Image();
startImage.src="images/start.png";
var introImage1 = new Image();
introImage1.src ="images/intro1.png";
var introImage2 = new Image();
introImage2.src="images/intro2.png";
var introImageSet = [introImage1, introImage2];

var wizards = [];
var peasants = [];

var CANVAS_GROUND = 230;
var MAX_SPEED = 7;
var TOLERANCE = 60;
var SELF_TOLERANCE = 20;
var SELF_TOLERANCE_BUFF = 30;

var intro = true;
var introClicked = false;

var introCounter = 0;

var score = 0;

var currentGameLoop = 0;
var FPS=30;

var introWaitTimer = 0;
var currentIntroImage = 0;

function gameInit(){
 	canvas.addEventListener('click', clickReporter, false);
	setInterval(
		function(){
				update();
				draw();
				write();
		},
		1000/FPS
	);
}

function loadIntro(){
	context.drawImage(hintImage,0,0);
}


function update() {
	
	//peasants
	peasants.forEach(function(peasant) {
		peasant.update();
	});
  	
  	peasants = peasants.filter(function(peasant) {
  		return peasant.active;
  	});
  	
  	
  	if (Math.random() < 0.05) {
  		peasants.push(Peasant());
  	}
  	
  	
  	//wizards
  	wizards.forEach(function(wizard) {
  		wizard.update();
  	});
  	
  	wizards = wizards.filter(function(wizards) {
  		return wizards.active;
  	});
  	
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

function write(){
	//context.font = "Don Quixote";
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
	
	I.speed = Math.floor(Math.random()*MAX_SPEED) + 1;
	
	I.inBounds = function() {
		if (I.x > canvas.width) {
			score -= 1000;
		}
		return (I.x <= canvas.width) && (I.x>=0);
	}
	
	I.covered = true;
	
	I.drawCovered = function (){
		context.fillStyle = "blue";
		context.fillRect(this.x, this.y, this.width, this.height);
	}
	
	I.spriteCounter = 0;
	I.time = 0;
	
	I.drawUncovered = function (){
		//draw non-animated
		//context.drawImage(wizardSprite,I.x,I.y);
		//draw 
		I.spriteCounter = I.spriteCounter%4;
		context.drawImage(wizardSpriteSet[I.spriteCounter], I.x, I.y);
		//context.drawImage(wizardSpriteSet[I.x%4], I.x, I.y);
		
		
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
	
	I.selfTolerance = Math.floor(I.width/2);//Math.floor(Math.random()*SELF_TOLERANCE)+Math.floor(I.width/2);
	
	I.speed = Math.floor(Math.random()*MAX_SPEED)+1;
	
	I.inBounds = function() {
		return (I.x <= canvas.width);
	}
	
	I.draw = function () {
		//context.drawImage(personSprite,((I.x%4)+2)*30,0,30,52,I.x,I.y,30,52);
		//context.fillStyle = "black";
		//context.strokeRect(I.x,I.y,35,35);
		context.drawImage(wizardSprite1, I.x, I.y);
	}
	
	I.react = function () {
		//context.drawImage(personSprite,(I.x%4)*30,0,30,52,I.x,I.y,30,52);
		//context.fillStyle = "black";
		//context.fillRect(I.x,I.y,35,35);
		context.drawImage(wizardSprite2,I.x,I.y);
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
				if (Math.abs(I.x-wizard.x) < I.selfTolerance) {
					timedReaction = true;
					var wiz = wizard;
					var wizX = wizard.x
				}
			}
		I.reaction = timedReaction;
		I.wizard = wiz;
		I.wizardX = wizX;
		});
	}
	
	I.reaction = false;
	
	return I;
	
}



function clickReporter(e) {
	var x = e.clientX;
	x -= canvas.offsetLeft;

		var uncovered_wizard_this_click = false;
		var number_of_wizards_uncovered = 0;
    	wizards.forEach(function(wizard) {
     	//within the toleranace
	     	if (Math.abs(x - wizard.x) <= TOLERANCE){
	     		wizard.covered = false;
	     		uncovered_wizard_this_click = true;
	     		number_of_wizards_uncovered += 1;
	     	}
    	});
    	if (uncovered_wizard_this_click == true){
    		score += 100 * number_of_wizards_uncovered;
    	}
    	else{
    		score -= 100;
    	}
    	//peasants.forEach(function(peasant){
     	//	if (Math.abs(x-peasant.x) <= TOLERANCE){
     	//		console.log("peasant x");
     	//		console.log(peasant.x);
     	//		console.log("reaction");
     	//		console.log(peasant.reaction);
     	//		console.log("wizard");
     	//		console.log(peasant.wizard);
     	//		console.log("wizardX");
     	//		console.log(peasant.wizardX);
     	//	}
     	//});

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
	console.log(coord);
	//hardcoded coords of where the start is, on canvas
	console.log(withinRange(x,635,675));
	console.log(withinRange(y,180,240));
	if (withinRange(x,635,740)){
		if (withinRange(y,180,240)){
			drawStart();
			unhookIntro();
			setTimeout(gameInit(), 2000);
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

