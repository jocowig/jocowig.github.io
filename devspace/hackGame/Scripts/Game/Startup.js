var game = new Phaser.Game({
	width: 960, 
	height: 540,
	parent: '',
	transparent: false,
	state: this,
	renderer: Phaser.AUTO,
	antialiasing: true,
	scaleMode: Phaser.ScaleManager.SHOW_ALL,
	preload: preload, 
	create: create, 
	update: update });
var gameState = 0;
var gameTimer = 1;
var startButton;
var title;
var messageCount = 10;
var messageText = new Array(messageCount);
var buttons = [];
var gameStarted = false;
var breathTimer;
var startBreaths = 20;
var baseBreathValue = 20;
var sanityBaseValue = 50;
var sanityTimer;
var showBreathMessage = [];
var showSanityMessage = [];
var actions = [];
var nextButton;
var breathsAvailable = startBreaths;
	
function preload() {
	// game.load.bitmapFont('silkscreen', 'assets/fonts/bitmapFonts/font.png', 'assets/fonts/bitmapFonts/font.fnt');
	game.load.image('title','assets/title.png');
}

function create() {
	game.scale.pageAlignHorizontally = true;
	game.scale.pageAlignVertically = true;
	game.scale.refresh();
	game.stage.backgroundColor = '#000000';
	// bmpText = game.add.bitmapText(200, 100, 'silkscreen', 'Test', 64);
	// bmpText.tint = 0x223344;


}

function update() {
	if(gameState == 0){
		gameTimer -= 1*game.time.physicsElapsed;
		if(gameTimer<=0){
		gameTimer = 0;
		gameState++;
		}
	}
	if(gameState == 1){
		title = game.add.sprite(game.world.centerX, game.world.centerY/2, 'title');
		title.anchor.setTo(0.5,0.5);
		title.alpha = 0.1;
		var enterTween = game.add.tween(title).to( { alpha: 1 }, 2000 *(60*game.time.physicsElapsed), "Linear");
		enterTween.start();
		gameState++;
		console.log("Finished!");
		enterTween.onComplete.add(createStartButton,this);
	}
	if(gameState == 2){
	}
	if(gameState == 3){
		gameTimer -= 1*game.time.physicsElapsed;
		if(gameTimer<=0){
			switch(nextButton){
				case "BREATHE":
					addButton(nextButton, game.world.centerX, game.world.centerY, breathe);
					nextButton = "YELL";
					gameTimer = 5;
					break;
				case "YELL":
					addButton(nextButton, game.world.centerX, (game.world.centerY-game.world.height/20), yell);
					nextButton = "SCREAM";
					gameTimer = 5;
					break;
				case "SCREAM":
					addButton(nextButton, game.world.centerX, (game.world.centerY-2*(game.world.height/20)), scream);
					nextButton = "MOVE";
					gameTimer = 10;
					break;
				case "MOVE":
					addButton(nextButton, game.world.centerX, (game.world.centerY+(game.world.height/20)), move);
					nextButton = "KICK";
					gameTimer = 10;
					break;
				case "KICK":
					addButton(nextButton, game.world.centerX, (game.world.centerY+2*(game.world.height/20)), kick);
					nextButton = "SCRATCH";
					gameTimer = 10;
					break;
				case "SCRATCH":
					addButton(nextButton, game.world.centerX, (game.world.centerY+3*(game.world.height/20)), scratch);
					nextButton = "CRY";
					gameTimer = 10;
					break;
				case "CRY":
					addButton(nextButton, game.world.centerX, (game.world.centerY-3*(game.world.height/20)), cry);
					nextButton = "";
					gameTimer = 10;
					break;
			}
		}
	}
	if(gameStarted){
		breathTimer -= 1*game.time.physicsElapsed;
		sanityTimer -= 1*game.time.physicsElapsed;
		if(sanityTimer > 0){
			enableDisabledButtons();
		}
		if(sanityTimer <=0 && showSanityMessage[0]){
			addMessage("You've Lost Your Mind");
			disable("MOVE");
			disable("KICK");
			disable("SCRATCH");
			showSanityMessage[0] = false;
		}
		else if(sanityTimer <= 5 && showSanityMessage[5]){
			addMessage("Terror is taking over");
			showSanityMessage[5] = false;
		}
		else if(sanityTimer <= 10 && showSanityMessage[10]){
			addMessage("You are starting to shake");
			showSanityMessage[10] = false;
		}
		if(breathTimer <=0){
			addMessage("You Suffocated");
			resetGame();
		}
		else if(breathTimer <=1 && showBreathMessage[1]){
			addMessage("You are convulsing");
			showBreathMessage[1] = false;
		}
		else if(breathTimer <=3 && showBreathMessage[3]){
			addMessage("You are feeling lightheaded");
			showBreathMessage[3] = false;
		}
		else if(breathTimer <=5 && showBreathMessage[10]){
			addMessage("Your lungs ache for air");
			showBreathMessage[10] = false;
		}
		
	}
}

function createStartButton(item){
	addButton("start", game.world.centerX, game.world.centerY, startGame);
}
function resetGame(){
	gameTimer = 3;
	gameState = 0;
	gameStarted = false;
	for(item in buttons){
		fadeOut(buttons[item],0);
	}
	for(item in actions){
		actions[item] = 0;
	}
	messageText.forEach(fadeOut);
	createMessageStatus();
	nextButton = "BREATHE";
}
function startGame(item){
	buttons["start"].visible = false;
	buttons["start"].events.onInputDown.remove(startGame, this);
	var exitTween = game.add.tween(title).to({alpha: 0}, 2000 * (60*game.time.physicsElapsed),"Linear");
	exitTween.start();
	exitTween.onComplete.add(function fadeComplete(){
	game.world.remove(title);
	gameState++;
	addMessage("It's Dark");
	gameTimer = 2;
	gameStarted = true;
	breathTimer = baseBreathValue;
	sanityTimer = sanityBaseValue;
	nextButton = "BREATHE";
	createMessageStatus();
	},this);
}

function addMessage(message){
	game.world.remove(messageText[0]);
	for(var i = 0; i<messageCount; i++){
		messageText[i] = messageText[i+1];
		if(messageText[i]!=null){
			messageText[i].y =messageText[i].y-messageText[i].height;
			messageText[i].alpha -= (1/messageCount);
		}
	}
	messageText[messageCount] = game.add.text(game.world.width/20, game.world.height- game.world.height/6, message, { font: "14px Arial", fill: "#ffffff", align: "Left" });
}

function addButton(buttonText, x, y, outputAction){
	buttons[buttonText] = game.add.text(x, y, buttonText, { font: "25px Arial", fill: "#ffffff", align: "center" });
	buttons[buttonText].anchor.setTo(0.5,0.5);
	buttons[buttonText].inputEnabled = true;
	buttons[buttonText].events.onInputDown.add(outputAction, this);
	return buttons[buttonText];
}

function fadeOut(item, index){
	if(item != null){
		var tween = game.add.tween(item).to({alpha: 0}, 2000 * (60*game.time.physicsElapsed),"Linear");
		tween.start();
		tween.onComplete.add(function finishedFadeOut(){game.world.remove(item);},this);
	}
	breathsAvailable = startBreaths;
}

function disable(buttonToDisable){
	buttons[buttonToDisable].alpha = 0.5;
	buttons[buttonToDisable].inputEnabled = false;
}

function enableDisabledButtons(){
	for(counter in buttons){
		if(!buttons[counter].inputEnabled){
			buttons[counter].alpha = 1;
			buttons[counter].inputEnabled = true;
		}
	}
}

function breathe(){
	addMessage("You drew a ragged breath");
	breathTimer = breathsAvailable/startBreaths * baseBreathValue;
	breathsAvailable--;
	buttons["BREATHE"].alpha = breathsAvailable/startBreaths;
	if(buttons["BREATHE"].alpha <= 0){
		game.world.remove(buttons["BREATHE"]);
	}
	resetBreathMessageStatus();
}

function createMessageStatus(){
	showBreathMessage[10]=true;
	showBreathMessage[5]=true;
	showBreathMessage[1]=true;
	showSanityMessage[10]=true;
	showSanityMessage[5]=true;
	showSanityMessage[0]=true;
}

function resetSanityMessageStatus(){
	for(count in showSanityMessage){
		if(sanityTimer >= count){
		showSanityMessage[count] = true;
		} 
	}
}

function resetBreathMessageStatus(){
	for(count in showBreathMessage){
		if(breathTimer >= count){
		showBreathMessage[count] = true;
		} 
	}
}
function yell(){
	addMessage("You yell for help at the top of your lungs");
	sanityTimer += 1;
	breathTimer -= 2;
}
function scream(){
	addMessage("You let loose a desperate, terrified scream");
	sanityTimer += 2;
	breathTimer -= 4;
}
function move(){
	if(actions["Moves"] == null){
		actions["Moves"] = 1;
	}
	else{
		actions["Moves"] +=1;
		addMessage("You try to move, but are completely stuck");
		breathTimer -= 2;
	}
}
function kick(){
	if(actions["Kicks"] == null){
		actions["Kicks"] = 1;
	}
	else{
		actions["Kicks"] +=1;
		addMessage("You kick at the walls but they do not give");
		breathTimer -= 4;
	}
}
function scratch(){
	if(actions["Scratches"] == null){
		actions["Scratches"] = 1;
	}
	else{
		actions["Scratches"] +=1;
		addMessage("You scratch at the walls, scraping away at them a little bit.");
		breathTimer -= 1;
	}
}
function cry(){
	sanityTimer += 5;  
	addMessage("You break down and cry in hopelessness, but manage to pull yourself together");
	breathTimer -= 4;
}