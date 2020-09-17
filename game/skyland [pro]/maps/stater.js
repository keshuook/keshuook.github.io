var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xa78fff, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
var light = new THREE.DirectionalLight( 0xffffff, 1, 100 );
light.position.set( 0, 1, 0 );
light.castShadow = true;
scene.add( light );

var texture = new THREE.TextureLoader().load(textures.ground);
var gmat = new THREE.MeshBasicMaterial( { map: texture } );

var geometry = new THREE.BoxGeometry();
// var gmat = new THREE.MeshBasicMaterial( { color: 0x009933 } );
var ground = new THREE.Mesh( geometry, gmat );
scene.add( ground );
ground.scale.x = 100;
ground.scale.z = 100;
ground.position.y = -1;
var redmat = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
var wall1 = new THREE.Mesh( geometry, redmat );
scene.add( wall1 );
wall1.scale.x = 20;
wall1.scale.y = 7.5;
wall1.scale.z = 0.5;
wall1.castShadow = true;
wall1.receiveShadow = true;
wall1.position.z = -20;

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
setInterval(mainloop,0.1)
function mainloop(){
	if(camera.position.x < -50 || camera.position.x > 50 || camera.position.z < -50 || camera.position.z > 50){
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
animate();
document.body.appendChild( renderer.domElement );
var object = [wall1]