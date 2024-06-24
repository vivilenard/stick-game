// Game state
let phase = "waiting"; // waiting | stretching | turning | walking | transitioning | falling
let lastTimestamp; // The timestamp of the previous animation cycle

let heroX; // Changes when moving forward
let heroY; // Only changes when falling
let sceneOffset; // Moves the whole game

let platforms = [];
let sticks = [];

let score = 0;

// Configuration
const canvasWidth = 375;
const canvasHeight = 375;
const platformHeight = 100;

// Getting the canvas element
const canvas = document.getElementById("game");

// Getting the drawing context
const ctx = canvas.getContext("2d");

// Further UI elements
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restart");

// Start game
resetGame();

// Resets game state and layout
function resetGame() {
	// Reset game state
	phase = "waiting";
	lastTimestamp = undefined;
  
	// The first platform is always the same
	platforms = [{ x: 50, w: 50 }];
	generatePlatform();
	generatePlatform();
	generatePlatform();
	generatePlatform();
  
	// Initialize hero position
	heroX = platforms[0].x + platforms[0].w - 30; // Hero stands a bit before the edge
	heroY = 0;
  
	// By how much should we shift the screen back
	sceneOffset = 0;
  
	// There's always a stick, even if it appears to be invisible (length: 0)
	sticks = [{ x: platforms[0].x + platforms[0].w, length: 0, rotation: 0 }];
	// sticks = [
	// 	{ x: 100, length: 50, rotation: 60 }
	//   ];
  
	//Score
	score = 0;
  
	// Reset UI
	restartButton.style.display = "none"; // Hide reset button
	scoreElement.innerText = score; // Reset score display
  
	draw();
  }

  function generatePlatform() {
	const minimumGap = 40;
	const maximumGap = 200;
	const minimumWidth = 20;
	const maximumWidth = 100;
  
	// X coordinate of the right edge of the furthest platform
	const lastPlatform = platforms[platforms.length - 1];
	let furthestX = lastPlatform.x + lastPlatform.w;
  
	const x =
	  furthestX +
	  minimumGap +
	  Math.floor(Math.random() * (maximumGap - minimumGap));
	const w =
	  minimumWidth + Math.floor(Math.random() * (maximumWidth - minimumWidth));
  
	platforms.push({ x, w });
  }

function draw() {
	ctx.clearRect(0,0,canvasWidth, canvasHeight);
	ctx.save(); //offset at 0
	ctx.translate(-sceneOffset, 0); //offset increases with every draw
	
	drawPlatforms();
	drawHero();
	drawSticks();

	ctx.restore(); //resets transitions to the last save (like the offset)
}

function drawPlatforms(){
	platforms.forEach(
		({x, w}) => {
			ctx.fillStyle = "black";
			ctx.fillRect(x, canvasHeight - platformHeight, w, platformHeight); //x,y,width,height
		}
	)
}

// Example state of sticks


function drawSticks() {
	sticks.forEach((stick) => {
	ctx.save();

	// Move the anchor point to the start of the stick and rotate
	ctx.translate(stick.x, canvasHeight - platformHeight); //sets the canvas center to somewhere else in the KO
	ctx.rotate((Math.PI / 180) * stick.rotation); //rotates the canvas in the KO OR same as rotating the KO in the canvas !

	// Draw stick
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(0, -stick.length);
	ctx.stroke();

	// Restore transformations
	ctx.restore();
	});
}

window.addEventListener("mousedown", function () {
 if (phase  == "waiting"){
	phase = "stretching";
	lastTimestamp = undefined;
	this.window.requestAnimationFrame(animate);
 }
});

window.addEventListener("mouseup", function () {
	if (phase == "stretching"){
		phase = "turning";
	}
});

restartButton.addEventListener("click", function(event){
	resetGame();
	restartButton.style.display = "none";
})

// function animate(timestamp) {
// }

//...