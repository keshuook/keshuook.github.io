/*
t means trader in thead,tbody and so on
the scene is called scene
the camera is called camera
I added a few textures (text stands for textures)
Fall is a array which chooses the area in which you are going to fall (See the comment marked "fall code")
*/

// This is where the threejs code for the trade island is written

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
var light = new THREE.DirectionalLight( 0xffffff, 1, 100 );
light.position.set( 0, 1, 0 );
light.castShadow = true;
scene.add( light );

var gtext = new THREE.TextureLoader().load(textures.ground);
var gmat = new THREE.MeshBasicMaterial( { map: gtext } );
var grmat = new THREE.MeshBasicMaterial( { color: 0x4a8f50 } );
var rwtext = new THREE.TextureLoader().load(textures.redwall);
var redmat = new THREE.MeshBasicMaterial( { map: rwtext } );
var woodtext = new THREE.TextureLoader().load(textures.wood);
var woodmat = new THREE.MeshBasicMaterial( { map: woodtext } );
var darkCubeMat = new THREE.MeshBasicMaterial( { color: 0x222222} );
var portalMat = new THREE.MeshBasicMaterial( { color: 0xE6FFCC} );

function canCut(){
	var cut = true;
	for(var i = 0;i < treeCut.length;i++){
		if(isNotColiding(treeCut[i])){
			if(cut){
				cut = true;
			}
		}else{
			cut = i;
		}
	}
}

var cubegeo = new THREE.BoxGeometry();
var spheregeo = new THREE.SphereGeometry( 5, 32, 32 );
var conegeo = new THREE.ConeGeometry( 5, 20, 32 );


var ground = new THREE.Mesh( cubegeo, gmat );
scene.add( ground );
ground.scale.x = 100;
ground.scale.z = 100;
ground.position.y = -1;

var wall1 = new THREE.Mesh( cubegeo, redmat );
var wall2 = new THREE.Mesh( cubegeo, redmat );
var wall3 = new THREE.Mesh( cubegeo, redmat );
var wall4 = new THREE.Mesh( cubegeo, redmat );
var wall5 = new THREE.Mesh( cubegeo, redmat );
var wall6 = new THREE.Mesh( cubegeo, redmat );
var inwall1 = new THREE.Mesh( cubegeo, woodmat );
var inwall2 = new THREE.Mesh( cubegeo, woodmat );
var inwall3 = new THREE.Mesh( cubegeo, woodmat );
var rotcube = new THREE.Mesh( cubegeo, darkCubeMat );
var portal = new THREE.Mesh( cubegeo, portalMat);
var thead = new THREE.Mesh( spheregeo, darkCubeMat);
var tbody = new THREE.Mesh( cubegeo, darkCubeMat);
var thand = new THREE.Mesh( cubegeo, darkCubeMat);

scene.add( wall1 );
scene.add( wall2 );
scene.add( wall3 );
scene.add( wall4 );
scene.add( wall5 );
scene.add( wall6 );
scene.add( rotcube );
scene.add( inwall1 );
scene.add( inwall2 );
scene.add( inwall3 );
scene.add( portal );
scene.add( thead );
scene.add( tbody );
scene.add( thand );

wall1.scale.x = 20;
wall2.scale.x = 20;
inwall1.scale.x = 10;
inwall2.scale.x = 0.2;
inwall3.scale.x = 0.2;
thead.scale.x = 0.1;
tbody.scale.x = 0.5;
thand.scale.x = 0.1;

wall1.scale.z = 0.5;
wall2.scale.z = 0.5;
wall3.scale.z = 20;
wall4.scale.z = 8.5;
wall5.scale.z = 8.5;
wall6.scale.z = 20;
inwall1.scale.z = 0.2;
inwall2.scale.z = 5;
inwall3.scale.z = 5;
portal.scale.z = 0.1;
thead.scale.z = 0.1;
tbody.scale.z = 0.5;
thand.scale.z = 1.25;

wall1.scale.y = 7.5;
wall2.scale.y = 7.5;
wall3.scale.y = 7.5;
wall4.scale.y = 7.5;
wall5.scale.y = 7.5;
wall6.scale.y = 2.5;
portal.scale.y = 5;
thead.scale.y = 0.1;
thand.scale.y = 0.1;

wall3.scale.x = 0.5;
wall4.scale.x = 0.5;
wall5.scale.x = 0.5;
wall6.scale.x = 20;
portal.scale.x = 2.5;

wall1.castShadow = true;
inwall1.receiveShadow = true;
ground.receiveShadow = true;
wall2.receiveShadow = true;

wall1.position.z = -20;
wall2.position.z = -40;
wall3.position.z = -30;
wall4.position.z = -24;
wall5.position.z = -36;
wall6.position.z = -30;
inwall1.position.z = -25;
inwall2.position.z = -22.5;
inwall3.position.z = -22.5;
rotcube.position.z = -30;
portal.position.z = 10;
thead.position.z = -22;
tbody.position.z = -22;
thand.position.z = -22;

wall3.position.x = -10;
wall4.position.x = 10;
wall5.position.x = 10;
inwall2.position.x = 5;
inwall3.position.x = -5;
thand.position.x = -0.5;

wall6.position.y = 5;
rotcube.position.y = 1.5;
thead.position.y = 1.5;
tbody.position.y = 1.05;
thand.position.y = 1.05;

thand.rotation.y = 0.8;

thand.rotation.x = 0.2;

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
setInterval(mainloop,0.1)
function mainloop(){
	rotcube.rotation.x += 0.01;
	rotcube.rotation.y += 0.01;
	rotcube.rotation.z += 0.01;
	if(fall[0] && (camera.position.x < -50 || camera.position.x > 50 || camera.position.z < -50 || camera.position.z > 50)){ // fall code
		var inter = setInterval(function(){
			camera.position.y -= 0.25;
		},80);
		setTimeout(function(){
			clearInterval(inter);
			camera.position.x = 0;
			camera.position.y = 0;
			camera.position.z = 5;
			requestOverlay();
		},1600);
	}
}
setInterval(function(){
	if(!isNotColiding(portal)){
		fall[0] = false;
		fall[1] = true;
		camera.position.x = "225";
		camera.position.z = "15";
		portalTransition();
	}
},10);
animate();
document.body.appendChild( renderer.domElement );
var trade = [inwall1,inwall2,inwall3];