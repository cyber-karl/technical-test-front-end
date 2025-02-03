import * as THREE from 'three';

export function setupLights(scene) {
    const light = new THREE.DirectionalLight(0xffffff, 4);
    light.position.set(10, 20, 10);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040, 10);
    scene.add(ambientLight);
}
