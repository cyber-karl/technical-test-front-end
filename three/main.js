import * as THREE from 'three';
import { setupLights } from './lights.js';
import { setupEnvironment } from './environment.js';
import { setupControls, updateMovement } from './controls.js';
import { spawnWindmillsFromAPI } from './windmills.js';
import {fetchFarms, fetchTurbines} from './api.js';
import { updateHoverText } from './hoverText.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.background = new THREE.Color(0x87CEEB);

setupLights(scene);
setupEnvironment(scene);
const controls = setupControls(camera, document.body);
const raycaster = new THREE.Raycaster(undefined, undefined, 0, undefined);
const mouse = new THREE.Vector2();
let mouseX = 0;
let mouseY = 0;
let farms = [];
let turbines = [];
let windmills = [];

async function initialize() {
    farms = await fetchFarms();
    turbines = await fetchTurbines();
    windmills = await spawnWindmillsFromAPI(scene, farms);
}

initialize();

window.addEventListener('mousemove', (event) => {
    if (!controls.isLocked) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    mouseX = event.clientX;
    mouseY = event.clientY;
});

camera.position.set(-100, 350, 750);

function animate() {
    requestAnimationFrame(animate);
    updateMovement(controls);
    updateHoverText(raycaster, mouse, camera, windmills, farms, turbines, controls, mouseX, mouseY);
    renderer.render(scene, camera);
}
animate();
