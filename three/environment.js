import * as THREE from 'three';

export function setupEnvironment(scene) {
    const fieldGeometry = new THREE.PlaneGeometry(100000, 100000);
    const fieldMaterial = new THREE.MeshBasicMaterial({ color: 0x2E6F40 });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.rotation.x = -Math.PI / 2;
    field.position.y = -300;
    scene.add(field);
}
