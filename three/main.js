import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

const loader = new GLTFLoader();
function spawnWindmills(numWindmills) {
    const windmillSpacing = 500;
    const windmillOffset = 5;

    const fieldGeometry = new THREE.PlaneGeometry(100000, 100000);
    const fieldMaterial = new THREE.MeshBasicMaterial({ color: 0x2e6f40 });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.rotation.x = -Math.PI / 2;
    field.position.y = -200;
    scene.add(field);

    for (let i = 0; i < numWindmills; i++) {
        loader.load('models/windmill.glb', function (gltf) {
            const windmill = gltf.scene;
            if (i !== 0) {
                windmill.position.set(i * windmillSpacing + windmillOffset, 0, 0);
            }

            scene.add(windmill);
        }, undefined, function (error) {
            console.error('Error loading windmill: ', error);
        });
    }
}

spawnWindmills(5);
scene.background = new THREE.Color(0x87CEEB);

let isRightClickPressed = false;
let cameraRotation = { x: 0, y: 0 };

const movementSpeed = 3;
const rotationSpeed = 0.002;
let movementDirection = new THREE.Vector3();
let isPointerLocked = false;

function lockPointer() {
    document.body.requestPointerLock();
    isPointerLocked = true;
}

function unlockPointer() {
    document.exitPointerLock();
    isPointerLocked = false;
}

document.addEventListener('mousemove', (event) => {
    if (isRightClickPressed && isPointerLocked) {
        const mouseDelta = new THREE.Vector2(
            event.movementX * rotationSpeed,
            event.movementY * rotationSpeed
        );

        cameraRotation.y -= mouseDelta.x;
        cameraRotation.x -= mouseDelta.y;
        cameraRotation.x = Math.max(Math.min(cameraRotation.x, Math.PI / 2), -Math.PI / 2);
        camera.rotation.set(cameraRotation.x, cameraRotation.y, 0);
    }
});

document.addEventListener('keydown', (event) => {
    // Update movement direction based on keys (WASD / Arrow keys)
    if (event.key === 'w' || event.key === 'ArrowUp') {
        movementDirection.z = -1;  // Move camera forward
    } else if (event.key === 's' || event.key === 'ArrowDown') {
        movementDirection.z = 1;   // Move camera backward
    } else if (event.key === 'a' || event.key === 'ArrowLeft') {
        movementDirection.x = -1;  // Move camera left
    } else if (event.key === 'd' || event.key === 'ArrowRight') {
        movementDirection.x = 1;   // Move camera right
    }
});

document.addEventListener('keyup', (event) => {
    // Stop movement when the corresponding key is released
    if (event.key === 'w' || event.key === 'ArrowUp') {
        movementDirection.z = 0;
    } else if (event.key === 's' || event.key === 'ArrowDown') {
        movementDirection.z = 0;
    } else if (event.key === 'a' || event.key === 'ArrowLeft') {
        movementDirection.x = 0;
    } else if (event.key === 'd' || event.key === 'ArrowRight') {
        movementDirection.x = 0;
    }
});

document.addEventListener('mousedown', (event) => {
    if (event.button === 2) { // Right mouse button (button === 2)
        isRightClickPressed = true;
        lockPointer();
    }
});

document.addEventListener('mouseup', (event) => {
    if (event.button === 2) {
        isRightClickPressed = false;
        unlockPointer();
    }
});

camera.position.set(-10, 350, 850);

function animate() {
    if (movementDirection.length() > 0) {
        movementDirection.normalize();
        camera.translateX(movementDirection.x * movementSpeed);
        camera.translateZ(movementDirection.z * movementSpeed);
    }

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
document.body.addEventListener('contextmenu', (event) => event.preventDefault());
