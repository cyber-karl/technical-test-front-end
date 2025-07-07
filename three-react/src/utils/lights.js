import * as THREE from "three";

export function setupLights(scene, directionalLightOptions = {}, ambientLightOptions = {}) {
    const light = new THREE.DirectionalLight(
        directionalLightOptions.color || 0xffffff,
        directionalLightOptions.intensity || 4
    );
    light.position.set(10, 20, 10);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(
        ambientLightOptions.color || 0x404040,
        ambientLightOptions.intensity || 10
    );
    scene.add(ambientLight);
}
