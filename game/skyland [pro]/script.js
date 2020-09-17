/*
This code is writen by keshuook.
It uses the threejs library.
*/
// defines the localStorage
var canHarvest = true;
if(localStorage.getItem("played")){
	var save = JSON.parse(localStorage.getItem('save'));
	treeFall(tree.t3);
	treeFall(tree.t1);
	setTimeout(function(){
		createTree(tree.t1,230,5);
	},132000);
	treeFall(tree.t2);
	setTimeout(function(){
		createTree(tree.t2,220,-10);
	},132000)
	setTimeout(function(){
		createTree(tree.t3,214,-16);
	},132000);
	alert("Welcome back");
	var harvestCrops = true;
	if(save.mm){
		var ismmmade = true;
	}
}else{
	localStorage.setItem("played",true);
	localStorage.setItem("save",JSON.stringify({
	'seeds':0,
	'leaf':3,
	'food':1,
	'wood':6,
	'metal':0,
	'money':0,
	'mm':false
}));
	alert("Welcome to Skyland [pro]");
	var harvestCrops = false;
	var ismmmade = false;
}
// Creates most of the variables for my game
var newPosX,newPosZ;
var fall = [false,true]
var name = "Unknown";
document.getElementById('info').classList.add('hide');
var move,zoomed,money = save.money,playAudio = true;
var sound = document.getElementById('gameMusic');
var movBy1 = 0.25,movBy2 = 0,movBy3 = 0.25,movBy4 = 0;
var xPos = 20,zPos = 20,d = 0.25;
var inventory = {
	'seeds':save.seeds,
	'leaf':save.leaf,
	'food':save.food,
	'wood':save.wood,
	'metal':save.metal
};
setInterval(function(){
	localStorage.setItem("save",JSON.stringify({
	'seeds':inventory.seeds,
	'leaf':inventory.leaf,
	'food':inventory.food,
	'wood':inventory.wood,
	'metal':inventory.metal,
	'money':money,
	'mm':ismmmade
}))
},2000);
inventory.wood -= 6;
inventory.leaf -= 3;
var canPlay = false;

// farming goes here and selling
function buy(item,price){
	if(money >= price){
		money -= price;
		item++;
		console.log(item);
		return item;
	}else{
		alert("You do not have enough money");
		return item;
	}	
}
function sell(item,price){
	if(item > 0){
		money += price;
		item--;
		console.log(item);
		return item;
	}else{
		alert("You do not have enough of this item");
		return item;
	}
}
function harvest(){
	if(canHarvest){
		inventory.food++;
		canHarvest = false;
		grassGrow(grass.g1,-0.9);
		grassGrow(grass.g2,-0.9);
		grassGrow(grass.g3,-0.9);
		grassGrow(grass.g4,-0.9);
	}else{
		alert("Cannot harvest crops");
	}
}
harvest();
inventory.food--;
var running;
function plant(){
	if(inventory.seeds > 0){
		if(!running && !canHarvest){
		var timeLeftToHarvest = 90.0; 
			inventory.seeds--;
			running = true;
			var timeRun = setInterval(function(){
				timeLeftToHarvest -= 0.1;
				grassGrow(grass.g1,0-timeLeftToHarvest/100);
				grassGrow(grass.g2,0-timeLeftToHarvest/100);
				grassGrow(grass.g3,0-timeLeftToHarvest/100);
				grassGrow(grass.g4,0-timeLeftToHarvest/100);
			},100)
			setTimeout(function(){
				canHarvest = true;
				running = false;
				clearInterval(timeRun)
			},90000);
		}else{
			alert("You already planted crops");
		}
	}else{
		alert("You dont have enough seeds");
	}
}
// I am adding a style element to the body which is needed to make the cursor disapear
var style = document.createElement("STYLE");
document.body.appendChild(style);

// Defines show overlay function
function requestOverlay(){
	canPlay = false;
	style.innerHTML = "";
	document.getElementById('overlay').style.opacity = "1";
	document.getElementById('overlay').style.display = 'block';
}
// Defines remove overlay function
function removeOverlay(){
	canPlay = true;
	setTimeout(function(){
		document.getElementById('overlay').style.display = 'none';
	},2000);
	style.innerHTML = "* {cursor: none;}";
	document.getElementById('overlay').style.opacity = "0";
}
// event listners on body such as mouse move are here
document.onclick = function(){
	removeOverlay();
}
document.oncontextmenu = function(ev){
	ev.preventDefault();
	if(playAudio){
		playAudio = false;
	}else{
		playAudio = true;
	}
}
// the key down checks weather a key is pressed. This is where the WASD and other key listners are there
document.onkeydown = function(ev){
	if(ev.keyCode == "88" && isNearColiding(tree.t1[0])){
		treeFall(tree.t1);
		setTimeout(function(){
			createTree(tree.t1,230,5);
		},132000);
	}
	if(ev.keyCode == "88" && isNearColiding(tree.t2[0])){
		treeFall(tree.t2);
		setTimeout(function(){
			createTree(tree.t2,220,-10);
		},132000);
	}
	if(ev.keyCode == "88" && isNearColiding(tree.t3[0])){
		treeFall(tree.t3);
		setTimeout(function(){
			createTree(tree.t3,214,-16);
		},132000);
	}
	if(ev.keyCode == "27"){
		requestOverlay();
	}else if(ev.keyCode == "9"){
		ev.preventDefault();
		document.getElementById('info').classList.remove('hide');
	}
	if (canPlay){
		if(ev.keyCode == "90"){
			d = 0.45;
		}
		if(ev.keyCode == "16"){
			d = 0.05;
		}
		if(ev.keyCode == "32"){
			// jump
		}
		if(ev.keyCode == "87"){
			ev.preventDefault();
			newPosX = camera.position.x - d*Math.sin(camera.rotation.y);
			newPosZ = camera.position.z -d*Math.cos(camera.rotation.y);
			if(canMove()){
				camera.position.x = newPosX;
				camera.position.z = newPosZ;
			}
		}else if(ev.keyCode == "83"){
			newPosX = camera.position.x + d*Math.sin(camera.rotation.y);
			newPosZ = camera.position.z + d*Math.cos(camera.rotation.y);
			if(canMove()){
				camera.position.x = newPosX;
				camera.position.z = newPosZ;
			}
		}else if(ev.keyCode == "65"){
			newPosX = camera.position.x - d*Math.cos(camera.rotation.y);
			newPosZ = camera.position.z + d*Math.sin(camera.rotation.y);
			if(canMove()){
				camera.position.x = newPosX;
				camera.position.z = newPosZ;
			}
		}else if(ev.keyCode == "68"){
			newPosX = camera.position.x + d*Math.cos(camera.rotation.y);
			newPosZ = camera.position.z - d*Math.sin(camera.rotation.y);
			if(canMove()){
				camera.position.x = newPosX;
				camera.position.z = newPosZ;
			}
		}
	}
		if(ev.keyCode == "32"){
			camera.position.y++;
			setTimeout(function(){
				camera.position.y--;
			},500);
		}
	
}


// This is key up listner. Which means if a key such as shift is down we need to stop crouching when it is realeased
document.onkeyup = function(ev){
	if(ev.keyCode == "9"){
		document.getElementById('info').classList.add('hide');
	}
	if(canPlay){
		if(ev.keyCode == "16"){
			d = 0.25;
		}
		if(ev.keyCode == "90"){
			d = 0.25;
		}
	}
}
// The mouse move makes it a first player game by sensing the mouse position
document.onmousemove = function (ev){
	movBy1 = 0.25 - camera.rotation.y;
	movBy2 = camera.rotation.y/2;
	if(canPlay){
		camera.rotation.y = -(ev.clientX/200 - window.innerWidth/400);
		camera.rotation.x = -(ev.clientY/350 - window.innerHeight/700);
	}
}
// Crashing into objects? it happens with the canMove which uses the isNotColiding function
function canMove(){
	var move = true;
	for(var i = 0;i < object.length;i++){
		if(isNotColiding(object[i])){
			if(move != false){
				move = true;
			}
		}else{
			move = false;
		}
	}
	if(!move){
		return false;
	}else{
		return true;
	}
}
// The isNotColiding function helps with detecting weather you colide or not with an object
function isNotColiding(obj){
	var s = obj.scale;
	var p = obj.position;
	var cp = {'x':newPosX,'z':newPosZ};
	if(cp.x < (s.x+0.5)/2.25+p.x && cp.x > p.x-(s.x+0.5)/2.25 && cp.z < (s.z+0.75)/2.25+p.z && cp.z > p.z-(s.z+0.75)/2.25){
		return false;
	}else{
		return true;
	}
}
document.getElementById('trade').style.display = '';
document.getElementById('farm').style.display = '';
// The trade is now not hidden scince the js has loaded and will be hidden with js. Same with the farm

// This shows the trade menu hence the name startTrade
function startTrade(){
	document.getElementById('trade').classList.remove('hide');
}
// This removes the trade menu
function stopTrade(){
	document.getElementById('trade').classList.add('hide');
}

stopTrade(); // Remember the comment where I clear the style so it can be added with js? here is where it is removed with js.

// This is your info (the menu can be shown if you hit tab)
setInterval(function(){
	document.getElementById('info').innerHTML = "Name: Unknown" + "<br>X: " + camera.position.x + "<br>Y: " + camera.position.y + "<br>Z: " + camera.position.z + "<br>rotationX: " + camera.rotation.x + "<br>rotationY: " + camera.rotation.y + "<br>rotationZ: " + camera.rotation.z + "<br>Money: " + money;
},0.1);

// the sound handeling happens here
sound.loop = true;
setInterval(function(){
	if(playAudio){
	sound.volume = 0.5;
		setInterval(function(){
			try{
				sound.play();
			}
			catch (error){
				
			}
		},50);
	}else{
		sound.volume = 0;
	}
},50);
// The trade handeling happens here.
setInterval(function(){
	var tr = true;
	for(var i = 0;i < trade.length;i++){
		if(isNotColiding(trade[i])){
			if(tr != false){
				tr = true;
			}
		}else{
			tr = false;
		}
	}
	if(!tr){
		startTrade();
		camera.position.z = -30;
		camera.position.x = 0;
		setTimeout(function(){
			// canPlay = false;
		},500);
	}
},10);
// A transition when you use the protals
function portalTransition(){
	var transit = document.createElement("DIV");
	document.body.appendChild(transit);
	d = 0;
	transit.id = "portalEffect";
	transit.style.opacity = "1";
	setTimeout(function(){
		d = 0.25;
		transit.remove();
	},2000);
}

// shows the farm menu
function showFarm(){
	document.getElementById('farm').classList.remove("hide");
	camera.position.x = 230;
	camera.position.z = -5;
}
// hides the farm menu
function hideFarm(){
	document.getElementById('farm').classList.add("hide");
}
hideFarm();// Remember the comment where I clear the style so it can be added with js? here is where it is removed with js.

// We need to handle the inventory count this will do it
setInterval(function(){
	var incount = document.getElementsByClassName('in-count');
	var initem = [inventory.seeds,inventory.food,inventory.wood,inventory.leaf,inventory.metal]
	for (var i = 0;i < incount.length;i++){
		incount[i].innerHTML = initem[i];
	}
},10);

// some basic threejs code is inserted and some other code needed for the 3d graphics.
scene.fog = new THREE.Fog(0xEEEEEE, 5, 40);
renderer.setClearColor( 0xa78fff, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


var object = [wall1,wall2,wall3,wall4,wall5,inwall1,inwall2,inwall3,tree.t1[0],tree.t2[0],tree.t3[0],mm1,mm2,mm3,mm4];
camera.position.x = 225;
camera.position.y = 0;
camera.position.z = 5;