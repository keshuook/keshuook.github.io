import * as THREE from './three.module.js'
import { GLTFLoader } from './GLTFLoader.js';

// Basic initialisation steps
// const scene = new THREE.Scene();
var scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x4F565E);

// Fix the screen if the user resizes.
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // Resets the aspect ratio if it has changed
    renderer.setSize(window.innerWidth, window.innerHeight); // Changes the size of the rendering canvas
});

document.body.appendChild(renderer.domElement); // Adds the canvas to the body tag.

// Add bala to the scene
const loader = new GLTFLoader();
loader.load("bala.glb", (object) => {
    console.log(object);
    scene = object.scene;
    const balaObject = scene.getObjectByName("Sphere");
    camera.position.z = 2;
    camera.lookAt(0, 0, 0);
    const light = new THREE.AmbientLight( 0xffffff ); // light to see bala
    scene.add(light);
    balaObject.rotateY(-Math.PI/2)
    document.getElementById("up-button").addEventListener("click", () => {
        balaObject.rotateZ(Math.PI/4);
    });
    document.getElementById("down-button").addEventListener("click", () => {
        balaObject.rotateZ(-Math.PI/4);
    });
    document.getElementById("left-button").addEventListener("click", () => {
        balaObject.rotateY(-Math.PI/4);
    });
    document.getElementById("right-button").addEventListener("click", () => {
        balaObject.rotateY(Math.PI/4);
    });
});

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render); // The render loop.
}
render();
