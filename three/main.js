import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {Vector3} from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 4);
light.position.set(10, 20, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040, 10);
scene.add(ambientLight);

scene.background = new THREE.Color(0x87CEEB);

const controls = new PointerLockControls(camera, document.body);

document.addEventListener('mousedown', (event) => {
    if (event.button === 2) {
        controls.lock();
    }
});

document.addEventListener('mouseup', (event) => {
    if (event.button === 2) {
        controls.unlock();
    }
});

document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

let moveSpeed = 0.5;
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const keys = { forward: false, backward: false, left: false, right: false };

document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': keys.forward = true; break;
        case 'ArrowDown':
        case 'KeyS': keys.backward = true; break;
        case 'ArrowLeft':
        case 'KeyA': keys.left = true; break;
        case 'ArrowRight':
        case 'KeyD': keys.right = true; break;
        case 'ShiftLeft': moveSpeed = 2; break;
    }
});
document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': keys.forward = false; break;
        case 'ArrowDown':
        case 'KeyS': keys.backward = false; break;
        case 'ArrowLeft':
        case 'KeyA': keys.left = false; break;
        case 'ArrowRight':
        case 'KeyD': keys.right = false; break;
        case 'ShiftLeft': moveSpeed = 0.5; break;
    }
});

const windmills = [];
const loader = new GLTFLoader();
function spawnWindmills(numWindmills) {
    const windmillSpacing = 750;

    for (let i = 0; i < numWindmills; i++) {
        loader.load('models/windmill.glb', (gltf) => {
            const windmill = gltf.scene;
            windmill.position.set(i * windmillSpacing, 0, 0);
            scene.add(windmill);
            windmills.push(windmill);
        });
    }
}

spawnWindmills(5); // Get from endpoint

const fieldGeometry = new THREE.PlaneGeometry(100000, 100000);
const fieldMaterial = new THREE.MeshBasicMaterial({ color: 0x2E6F40 });
const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
field.rotation.x = -Math.PI / 2;
field.position.y = -300;
scene.add(field);

const raycaster = new THREE.Raycaster(undefined, undefined, 0, undefined);
const mouse = new THREE.Vector2();
const hoverText = document.createElement('div');
let mouseX = 0;
let mouseY = 0;

hoverText.style.position = 'absolute';
hoverText.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
hoverText.style.color = 'white';
hoverText.style.padding = '5px';
hoverText.style.borderRadius = '5px';
hoverText.style.display = 'none';
document.body.appendChild(hoverText);

window.addEventListener('mousemove', (event) => {
    if (!controls.isLocked) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    mouseX = event.clientX;
    mouseY = event.clientY;
});

function updateMovement() {
    velocity.set(0, 0, 0);

    if (keys.forward) velocity.z += moveSpeed;
    if (keys.backward) velocity.z -= moveSpeed;
    if (keys.left) velocity.x -= moveSpeed;
    if (keys.right) velocity.x += moveSpeed;

    direction.copy(velocity).normalize();
    controls.moveRight(direction.x * moveSpeed);
    controls.moveForward(direction.z * moveSpeed);
}

function updateHoverText() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(windmills, true);

    if (intersects.length > 0 && !controls.isLocked) {
        const intersected = intersects[0].object;
        const worldPosition = new THREE.Vector3();
        intersected.getWorldPosition(worldPosition);
        hoverText.style.display = 'block';
        hoverText.style.left = `${mouseX + 16}px`;
        hoverText.style.top = `${mouseY + 16}px`;
        hoverText.innerHTML = `Windmill at (
            ${worldPosition.x.toFixed(1)},
            ${worldPosition.y.toFixed(1)},
            ${worldPosition.z.toFixed(1)}
        )<br>Components:`;
    } else {
        hoverText.style.display = 'none';
    }
}

camera.position.set(-100, 350, 750);

function animate() {
    requestAnimationFrame(animate);
    updateMovement();
    updateHoverText();
    renderer.render(scene, camera);
}
animate();
