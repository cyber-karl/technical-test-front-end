import { Vector3 } from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

let moveSpeed = 0.5;
const velocity = new Vector3();
const direction = new Vector3();
const keys = { forward: false, backward: false, left: false, right: false };

export function setupControls(camera, domElement) {
    const controls = new PointerLockControls(camera, domElement);

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

    return controls;
}

export function updateMovement(controls) {
    velocity.set(0, 0, 0);

    if (keys.forward) velocity.z += moveSpeed;
    if (keys.backward) velocity.z -= moveSpeed;
    if (keys.left) velocity.x -= moveSpeed;
    if (keys.right) velocity.x += moveSpeed;

    direction.copy(velocity).normalize();
    controls.moveRight(direction.x * moveSpeed);
    controls.moveForward(direction.z * moveSpeed);
}
