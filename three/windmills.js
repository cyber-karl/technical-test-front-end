import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { fetchFarms } from './api.js';

const loader = new GLTFLoader();


export async function spawnWindmillsFromAPI(scene, farms) {
    const windmills = [];
    const windmillSpacing = 750;

    farms.forEach((farm, index) => {
        loader.load('models/windmill.glb', (gltf) => {
            const windmill = gltf.scene;
            windmill.position.set(index * windmillSpacing, 0, 0);
            windmill.userData.farmId = farm.id;
            scene.add(windmill);
            windmills.push(windmill);
        });
    });

    return windmills;
}
