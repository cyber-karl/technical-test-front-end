import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import windmillModel from '../models/windmill.glb';

const loader = new GLTFLoader();

export async function spawnWindmillsFromAPI(scene, farmId, turbines) {
    const windmills = [];
    const spacing = 1000;

    turbines.forEach((turbine, index) => {
        loader.load(
            windmillModel,
            (gltf) => {
                const windmill = gltf.scene;
                windmill.position.set(index * spacing, 0, 0);
                windmill.userData.farmId = farmId;
                windmill.userData.turbineId = turbine.id;
                scene.add(windmill);
                windmills.push(windmill);
            },
            undefined,
            (error) => {
                console.error('Error loading windmill model:', error);
            }
        );

    })

    return windmills;
}
