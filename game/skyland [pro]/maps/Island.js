/*
the scene is called scene
the camera is called camera
Fall is a array which chooses the area in which you are going to fall (See the comment marked "fall code")
see maps/trade.js or script.js for more 
*/
var brownGMat = new THREE.MeshBasicMaterial( { color: 0x882525} );
var mtext = new THREE.TextureLoader().load(textures.metal);
var metalmat = new THREE.MeshBasicMaterial( { map: mtext } );

var islandground = new THREE.Mesh( cubegeo, gmat );
var islandportal = new THREE.Mesh( cubegeo, portalMat);
var field = new THREE.Mesh(cubegeo, brownGMat);
var mm1 = new THREE.Mesh(cubegeo, metalmat);
var mm2 = new THREE.Mesh(cubegeo, metalmat);
var mm3 = new THREE.Mesh(cubegeo, metalmat);
var mm4 = new THREE.Mesh(cubegeo, metalmat);

scene.add( islandground );
scene.add( islandportal );
scene.add( field );

islandground.scale.x = 50;
islandportal.scale.x = 2.5;
field.scale.x = 3.5;
mm1.scale.x = 3.5;
mm2.scale.x = 0.5;
mm3.scale.x = 3.5;
mm4.scale.x = 5;

islandportal.scale.y = 5;
field.scale.y = 0.5;
mm1.scale.y = 2;
mm2.scale.y = 2;
mm3.scale.y = 2;
mm4.scale.y = 5;

islandportal.scale.z = 0.1;
islandground.scale.z = 50;
field.scale.z = 3.5;
mm1.scale.z = 0.5;
mm2.scale.z = 3.5;
mm3.scale.z = 0.5;
mm4.scale.z = 3.5;

islandground.position.x = 225;
islandportal.position.x = 225;
field.position.x = 231;
mm1.position.x = 210;
mm2.position.x = 211.5;
mm3.position.x = 210;
mm4.position.x = 208;

islandground.position.y = -1;
field.position.y = -0.74;

islandportal.position.z = 10;
field.position.z = -11;
mm1.position.z = 5;
mm2.position.z = 7;
mm3.position.z = 9;
mm4.position.z = 7;

function createGrass(obj,x,z){
	for (var i = 0;i < 4;i++){
		obj[i] = new THREE.Mesh( cubegeo, grmat);
		obj[i].scale.z = 0.25;
		obj[i].scale.x = 0.25;
		scene.add(obj[i]);
	}
	obj[0].position.x = x+0.5;
	obj[1].position.x = x-0.5;
	obj[2].position.x = x+0.5;
	obj[3].position.x = x-0.5;
	obj[0].position.z = z+0.5
	obj[1].position.z = z+0.5
	obj[2].position.z = z-0.5
	obj[3].position.z = z-0.5
}
function grassGrow(obj,size){
	for(var i = 0;i < 4;i++){
		obj[i].position.y = size;
	}
}
var tree = {
	't1':[new THREE.Mesh( cubegeo, woodmat ), new THREE.Mesh( conegeo, grmat )],
	't2':[new THREE.Mesh( cubegeo, woodmat ), new THREE.Mesh( conegeo, grmat )],
	't3':[new THREE.Mesh( cubegeo, woodmat ), new THREE.Mesh( conegeo, grmat )],
}
function createTree(obj,x,z){
	obj[0].scale.y = 3;
	obj[1].scale.x = 0.5;
	obj[1].scale.z = 0.5;
	obj[1].scale.y = 0.3;
	
	obj[0].rotation.x = 0;
	obj[0].rotation.y = 0;
	obj[1].rotation.x = 0;
	obj[1].rotation.y = 0;
	
	obj[0].position.x = x;
	obj[0].position.y = 1;
	obj[0].position.z = z;
	obj[1].position.x = x;
	obj[1].position.y = 4;
	obj[1].position.z = z;
	scene.add(obj[0]);
	scene.add(obj[1]);
}
function mineMachine(){
	scene.add(mm1);
	scene.add(mm2);
	scene.add(mm3);
	scene.add(mm4);
	setInterval(function(){
		inventory.metal++;
	},8000);
}
if(save.mm){
	mineMachine();
	document.getElementById('mmbb').remove();
}
createTree(tree.t1,230,5);
createTree(tree.t2,220,-10);
createTree(tree.t3,214,-16);
function treeFall(obj){
	var fs = 100;
	var fall = setInterval(function(){
		obj[0].rotation.x -= 0.125;
		obj[1].rotation.x -= 0.125;
		obj[1].position.y -= 0.125;
		obj[1].position.z -= 0.35;
		fs += 0.2;
	},fs);
	setTimeout(function(){
		clearInterval(fall);
	},1000);
	setTimeout(function(){
		obj[0].position.y -= 4000;
		obj[1].position.y -= 4000;
		obj[0].position.x -= 4000;
		inventory.wood += 2;
		inventory.leaf++;
	},1600);
}
var grass = {
	'g1':[null,null,null,null],
	'g2':[null,null,null,null],
	'g3':[null,null,null,null],
	'g4':[null,null,null,null],
	'info':{
		'position':{
			'x':null,
			'z':null,
		},
		'scale':{
			'x':null,
			'z':null,
		}
	}
};
createGrass(grass.g1,230,-10);
createGrass(grass.g2,232,-10);
createGrass(grass.g3,230,-12);
createGrass(grass.g4,232,-12);
grass.info.position.x = 231;
grass.info.position.z = -11;
grass.info.scale.x = 2;
grass.info.scale.z = 2;

setInterval(function(){
	if(!isNotColiding(islandportal)){
		fall[0] = true;
		fall[1] = false;
		camera.position.x = "0";
		camera.position.z = "15";
		portalTransition();
	}
	if(!isNotColiding(grass.info)){
		showFarm();
	}
	if(fall[1] && (camera.position.x < 200 || camera.position.x > 250 || camera.position.z < -25 || camera.position.z > 25)){ //fall code
		var inter = setInterval(function(){
			camera.position.y -= 0.25;
		},80);
		setTimeout(function(){
			clearInterval(inter);
			camera.position.x = 225;
			camera.position.y = 0;
			camera.position.z = 5;
			requestOverlay();
		},1600);
	}
},10);
function isNearColiding(obj){
	var s = obj.scale;
	var p = obj.position;
	var cp = camera.position;
	if(cp.x < (s.x+1)/2.25+p.x && cp.x > p.x-(s.x+1)/2.25 && cp.z < (s.z+1.25)/2.25+p.z && cp.z > p.z-(s.z+1.25)/2.25){
		return true;
	}else{
		return false;
	}
}
function buyMineMach(){
	if(inventory.metal >= 4){
		inventory.metal -= 4;
		mineMachine();
	}else{
		alert("You need four metal");
	}
}