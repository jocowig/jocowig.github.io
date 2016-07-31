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
var centerX = 960/2;
var centerY = 540/2;
var gameWidth = 960;
var gameHeight = 540;
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
var stageStatus;
var digCounter = 0;
var showBreathMessage = [];
var showSanityMessage = [];
var actions = [];
var progress = {};
var actionNames = ["Breathe", "Yell", "Scream", "Move", "Kick", "Scratch", "Cry"];
var progressNames = ["first","second","third"];
var actions = {
	Breathe:{
		name: "Breathe",
		count:0,
		messages: {first:"", second:"",third:"",base:"You draw a ragged breath"},
		xPos: centerX,
		yPos: centerY,
		breathCost:0,
		sanityCost:0,
		min:0,
		max:0,
		conditions: {first:{Breathe:1, Yell:0, Scream:0, Move:0, Kick:0, Scratch:0, Cry:0},
					second:{Breathe:1, Yell:0, Scream:0, Move:0, Kick:0, Scratch:0, Cry:0},
					third:{Breathe:1, Yell:0, Scream:0, Move:0, Kick:0, Scratch:0, Cry:0}}
	},
	Yell:{
		name: "Yell",
		count:0,
		messages: {first:"", second:"",third:"",base:"You shout for help as loud as you can"},
		xPos: centerX,
		yPos: centerY-gameHeight/10,
		breathCost:2,
		sanityCost:-2,
		min:0,
		max:0,
		conditions: {first:{Breathe:0, Yell:1, Scream:0, Move:0, Kick:0, Scratch:0, Cry:0},
					second:{Breathe:0, Yell:1, Scream:0, Move:0, Kick:0, Scratch:0, Cry:0},
					third:{Breathe:0, Yell:1, Scream:0, Move:0, Kick:0, Scratch:0, Cry:0}}
	},
	Scream:{
		name: "Scream",
		count:0,
		messages: {first:"", second:"",third:"",base:"You let loose a desperate, terrified scream"},
		xPos: centerX,
		yPos: centerY-2*gameHeight/10,
		breathCost:4,
		sanityCost:-6,
		min:0,
		max:0,
		conditions: {first:{Breathe:0, Yell:0, Scream:1, Move:0, Kick:0, Scratch:0, Cry:0},
					second:{Breathe:0, Yell:0, Scream:1, Move:0, Kick:0, Scratch:0, Cry:0},
					third:{Breathe:0, Yell:0, Scream:1, Move:0, Kick:0, Scratch:0, Cry:0}}
	},
	Move:{
		name: "Move",
		count:0,
		messages: {first:"You feel something shift slightly", second:"The walls are weakening",third:"The walls are now loose",base:"You writhe against the walls"},
		xPos: centerX,
		yPos: centerY+gameHeight/10,
		breathCost:2,
		sanityCost:0,
		min:0,
		max:4,
		conditions: {first:{Breathe:0, Yell:0, Scream:0, Move:2, Kick:0, Scratch:0, Cry:0},
					second:{Breathe:0, Yell:0, Scream:0, Move:8, Kick:0, Scratch:0, Cry:0},
					third:{Breathe:0, Yell:0, Scream:0, Move:15, Kick:0, Scratch:0, Cry:0}}
	},
	Kick:{
		name: "Kick",
		count:0,
		messages: {first:"You feel the wall crack a bit", second:"You've kicked a good size dent in the wall",third:"You've kicked a hole in the wall",base:"You kick at the walls"},
		xPos: centerX,
		yPos: centerY+2*gameHeight/10,
		breathCost:0,
		sanityCost:0,
		min:0,
		max:8,
		conditions: {first:{Breathe:0, Yell:0, Scream:0, Move:0, Kick:8, Scratch:0, Cry:0},
					second:{Breathe:0, Yell:0, Scream:0, Move:0, Kick:40, Scratch:0, Cry:0},
					third:{Breathe:0, Yell:0, Scream:0, Move:0, Kick:80, Scratch:0, Cry:0}}
	},
	Scratch:{
		name: "Scratch",
		count:0,
		messages: {first:"You scrape a little bit of the walls away", second:"You've scraped a good chunk of the walls away",third:"You've scraped away as much as you can",base:"You scratch at the walls"},
		xPos: centerX,
		yPos: centerY+3*gameHeight/10,
		breathCost:2,
		sanityCost:1,
		min:0,
		max:2,
		conditions: {first:{Breathe:0, Yell:0, Scream:0, Move:2, Kick:0, Scratch:2, Cry:0},
					second:{Breathe:0, Yell:0, Scream:0, Move:2, Kick:0, Scratch:10, Cry:0},
					third:{Breathe:0, Yell:0, Scream:0, Move:2, Kick:0, Scratch:20, Cry:0}}
	},
	Cry:{
		name: "Cry",
		count:0,
		messages: {first:"", second:"",third:"",base:"You break down crying in your hopelessness"},
		xPos: centerX,
		yPos: centerY-3*gameHeight/10,
		breathCost:8,
		sanityCost:-15,
		min:0,
		max:0,
		conditions: {first:{Breathe:0, Yell:0, Scream:0, Move:0, Kick:0, Scratch:0, Cry:1},
					second:{Breathe:0, Yell:0, Scream:0, Move:0, Kick:0, Scratch:0, Cry:1},
					third:{Breathe:0, Yell:0, Scream:0, Move:0, Kick:0, Scratch:0, Cry:1}}
	}
};
var times = [5,5,10,10,10,10,10];
var nextButton;
var breathsAvailable = startBreaths;
	
function preload() {
	// game.load.bitmapFont('silkscreen', 'assets/fonts/bitmapFonts/font.png', 'assets/fonts/bitmapFonts/font.fnt');
	game.load.image('title','assets/Title.png');
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
		enterTween.onComplete.add(createStartButton,this);
	}
	if(gameState == 2){
	}
	if(gameState == 3){
		gameTimer -= 1*game.time.physicsElapsed;
		if(gameTimer<=0){
			addButton(actions[actionNames[nextButton]].name, actions[actionNames[nextButton]].xPos, actions[actionNames[nextButton]].yPos);
			nextButton++;
			gameTimer = times[nextButton];
		}
	}
	if(gameStarted){
		breathTimer -= 1*game.time.physicsElapsed;
		sanityTimer -= 1*game.time.physicsElapsed;
		if(sanityTimer<0){
			sanityTimer = 0;
		}
		if(sanityTimer > 0){
			enableDisabledButtons();
		}
		if(sanityTimer <=0 && showSanityMessage[0]){
			addMessage("You've Lost Your Mind");
			disable("Move");
			disable("Kick");
			disable("Scratch");
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
	messageText.forEach(fadeOut);
	createMessageStatus();
}
function startGame(){
	buttons["start"].visible = false;
	buttons["start"].events.onInputDown.remove(startGame, this);
	var exitTween = game.add.tween(title).to({alpha: 0}, 2000 * (60*game.time.physicsElapsed),"Linear");
	exitTween.start();
	exitTween.onComplete.add(function fadeComplete(){
	game.world.remove(title);
	gameState++;
	stageStatus = 0;
	addMessage("It's Dark");
	gameTimer = 2;
	gameStarted = true;
	breathTimer = baseBreathValue;
	sanityTimer = sanityBaseValue;
	nextButton = 0;
	digCounter = 0;
	progress = {Breathe:0, Yell:0, Scream:0, Move:0, Kick:0, Scratch:0, Cry:0};
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

function addButton(buttonText, x, y){
	buttons[buttonText] = game.add.text(x, y, buttonText, { font: "25px Arial", fill: "#ffffff", align: "center" });
	buttons[buttonText].anchor.setTo(0.5,0.5);
	buttons[buttonText].inputEnabled = true;
	buttons[buttonText].input.useHandCursor = true;
	buttons[buttonText].events.onInputDown.add(action, {buttonType:buttonText});
	return buttons[buttonText];
}

function fadeOut(item, index){
	if(item != null){
		item.inputEnabled = false;
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

function getRandomNumberInRange(min, max){
	 return Math.random() * (max - min) + min;
}

function breathe(){
	breathTimer = breathsAvailable/startBreaths * baseBreathValue;
	breathsAvailable--;
	buttons["Breathe"].alpha = breathsAvailable/startBreaths;
	if(buttons["Breathe"].alpha <= 0){
		game.world.remove(buttons["Breathe"]);
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

function action(){
	if(this.buttonType == "start"){
		startGame();
		return;
	}
	if(this.buttonType == "Dig"){
		dig();
		return;
	}
	var randomIndex = getRandomNumberInRange(actions[this.buttonType].min,actions[this.buttonType].max);
	addMessage(actions[this.buttonType].messages.base);
	actions[this.buttonType].count +=randomIndex;
	if(progress[this.buttonType]<3){
		if(conditionsMet(this.buttonType)){
			addMessage(actions[this.buttonType].messages[progressNames[progress[this.buttonType]]]);
			progress[this.buttonType]++;
			results();
		}
	}
	breathTimer -= actions[this.buttonType].breathCost;
	sanityTimer -= actions[this.buttonType].sanityCost;
	if(this.buttonType == "Breathe")
		breathe();
}

function conditionsMet(name){
	for(actionIndex in actions){
		if(actions[actionIndex].count < actions[name].conditions[progressNames[progress[name]]][actionIndex]){
			return false;
		}
	}
	return true;
}

function results(){
	if(progress["Move"] >=1 && progress["Kick"] >= 1 && progress["Scratch"] >= 1 && (stageStatus == 0)){
		addMessage("You've Managed to free some space for yourself and have opened a small air pocket");
		breathsAvailable = startBreaths;
		stageStatus++;
	}
	if(progress["Move"] >= 2 && progress["Kick"] >= 2 && progress["Scratch"] >= 2 && (stageStatus == 1)){
		addMessage("Another air pocket has opened and you can bend your arms");
		breathsAvailable = startBreaths;
		stageStatus++;
	}
	if(progress["Move"] >= 3 && progress["Kick"] >= 3 && progress["Scratch"] >= 3 && (stageStatus == 2)){
		addMessage("The boards give way beneath you and you can feel earth your fingertips");
		breathsAvailable= startBreaths;
		addButton("Dig", game.world.centerX + game.world.width/4, game.world.centerY);
		stageStatus++;
	}
}
function dig(){
	digCounter++;
	addMessage("You frantically dig")
	if(digCounter == 5){
		addMessage("The earth is giving way more easily now");
	}
	if(digCounter == 10){
		addMessage("The earth above you is starting to cave in");
		breathsAvailable = breathsAvailable/2;
	}
	if(digCounter == 15){
		addMessage("There is a harder surface here");
		breathsAvailable = breathsAvailable/2;
	}
	if(digCounter == 20){
		addMessage("You break though the hard surface, and fall...");
		resetGame();
	}
}

