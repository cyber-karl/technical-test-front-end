import { Vector3 } from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

export function setupControls(camera, domElement, options = {}) {
    let { moveSpeed = 0.5, sprintSpeed = 2 } = options;
    const keys = { forward: false, backward: false, left: false, right: false };

    const controls = new PointerLockControls(camera, domElement);

    const handleMouseDown = (event) => {
        if (event.button === 2) {
            controls.lock();
        }
    };

    const handleMouseUp = (event) => {
        if (event.button === 2) {
            controls.unlock();
        }
    };

    const handleContextMenu = (event) => {
        event.preventDefault();
    };

    const handleKeyDown = (event) => {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW': keys.forward = true; break;
            case 'ArrowDown':
            case 'KeyS': keys.backward = true; break;
            case 'ArrowLeft':
            case 'KeyA': keys.left = true; break;
            case 'ArrowRight':
            case 'KeyD': keys.right = true; break;
            case 'ShiftLeft': moveSpeed = sprintSpeed; break;
        }
    };

    const handleKeyUp = (event) => {
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW': keys.forward = false; break;
            case 'ArrowDown':
            case 'KeyS': keys.backward = false; break;
            case 'ArrowLeft':
            case 'KeyA': keys.left = false; break;
            case 'ArrowRight':
            case 'KeyD': keys.right = false; break;
            case 'ShiftLeft': moveSpeed = options.moveSpeed; break;
        }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return { controls, updateMovement: () => updateMovement(controls, keys, moveSpeed) };
}

export function updateMovement(controls, keys, moveSpeed) {
    const velocity = new Vector3();
    const direction = new Vector3();

    if (keys.forward) velocity.z += moveSpeed;
    if (keys.backward) velocity.z -= moveSpeed;
    if (keys.left) velocity.x -= moveSpeed;
    if (keys.right) velocity.x += moveSpeed;

    direction.copy(velocity).normalize();
    controls.moveRight(direction.x * moveSpeed);
    controls.moveForward(direction.z * moveSpeed);
}
