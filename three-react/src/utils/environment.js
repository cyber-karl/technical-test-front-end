import * as THREE from "three";

export function setupEnvironment(scene, options = {}) {
    const {
        width = 100000,
        height = 100000,
        color = 0x2E6F40,
        rotationX = -Math.PI / 2,
        positionY = -300
    } = options;

    const fieldGeometry = new THREE.PlaneGeometry(width, height);
    const fieldMaterial = new THREE.MeshBasicMaterial({ color });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.rotation.x = rotationX;
    field.position.y = positionY;
    scene.add(field);
}
