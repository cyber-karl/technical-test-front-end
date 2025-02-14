import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { setupLights } from '../utils/lights';
import { setupEnvironment } from '../utils/environment';
import { setupControls } from '../utils/controls';
import { spawnWindmillsFromAPI } from '../utils/windmillLoader';
import { fetchFarms, fetchTurbines } from '../utils/api';
import { updateHoverText } from './HoverText';
import FarmMenu from './FarmMenu';
import { ClipLoader } from 'react-spinners';
import { CSSProperties } from 'react';
import {ControlPanel} from "./ControlPanel";

const Scene = () => {
    const [hoverText, setHoverText] = useState({ visible: false, content: '', x: 0, y: 0 });
    const [farms, setFarms] = useState([]);
    const [selectedFarm, setSelectedFarm] = useState(null);
    const [turbines, setTurbines] = useState([]);
    const [windmills, setWindmills] = useState([]);
    const [windmillsLoading, setWindmillsLoading] = useState(false);
    const mountRef = useRef(null);

    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const animationFrameRef = useRef(null);
    const controlsRef = useRef(null);
    const raycasterRef = useRef(null);
    const mouseRef = useRef(new THREE.Vector2());
    const mousePosRef = useRef({ x: 0, y: 0 });

    const farmsRef = useRef([]);
    const turbinesRef = useRef([]);
    const windmillsRef = useRef([]);

    useEffect(() => {
        farmsRef.current = farms;
    }, [farms]);

    useEffect(() => {
        turbinesRef.current = turbines;
    }, [turbines]);

    useEffect(() => {
        windmillsRef.current = windmills;
    }, [windmills]);

    useEffect(() => {
        sceneRef.current = new THREE.Scene();
        cameraRef.current = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            10000
        );
        rendererRef.current = new THREE.WebGLRenderer({
            powerPreference: "high-performance",
            antialias: true
        });
        raycasterRef.current = new THREE.Raycaster();

        const renderer = rendererRef.current;
        const scene = sceneRef.current;
        const camera = cameraRef.current;

        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current?.appendChild(renderer.domElement);

        scene.background = new THREE.Color(0x87CEEB);

        setupLights(
            scene,
            { color: 0xffffff, intensity: 5 },
            { color: 0x404040, intensity: 8 }
        );

        setupEnvironment(
            scene,
            { width: 200000, height: 200000, color: 0x3E8F50, positionY: -400 }
        );

        const { controls, updateMovement } = setupControls(
            camera,
            mountRef.current,
            { moveSpeed: 0.5, sprintSpeed: 2 }
        );
        controlsRef.current = controls;

        const handleMouseMove = (event) => {
            if (!controlsRef.current?.isLocked) {
                mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
            }
            mousePosRef.current = { x: event.clientX, y: event.clientY };
        };

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        camera.position.set(-100, 350, 750);

        const animate = () => {
            animationFrameRef.current = requestAnimationFrame(animate);
            if (controlsRef.current) {
                updateMovement();
            }

            updateHoverText(
                raycasterRef.current,
                mouseRef.current,
                camera,
                windmillsRef.current,
                farmsRef.current,
                turbinesRef.current,
                controlsRef.current,
                mousePosRef.current.x,
                mousePosRef.current.y,
                setHoverText
            );

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            if (renderer) {
                renderer.dispose();
                renderer.forceContextLoss();
                renderer.domElement.remove();
            }

            if (scene) {
                scene.traverse((object) => {
                    if (object.geometry) {
                        object.geometry.dispose();
                    }
                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach(material => material.dispose());
                        } else {
                            object.material.dispose();
                        }
                    }
                });
            }

            sceneRef.current = null;
            cameraRef.current = null;
            rendererRef.current = null;
            controlsRef.current = null;
            raycasterRef.current = null;
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const farmsData = await fetchFarms();
            setFarms(farmsData);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedFarm && sceneRef.current) {
            const initializeWindmills = async () => {
                try {
                    const windmillData = await spawnWindmillsFromAPI(sceneRef.current, selectedFarm, turbines);
                    setWindmills(windmillData);
                } catch (error) {
                    console.error('Error loading windmills:', error);
                } finally {
                    setWindmillsLoading(false);
                }
            };

            initializeWindmills();
        }
    }, [selectedFarm, turbines]);

    const handleFarmSelect = async (farmId) => {
        try {
            setWindmillsLoading(true);
            const turbinesData = await fetchTurbines(farmId);
            setTurbines(turbinesData);
            setSelectedFarm(farmId);
        } catch (error) {
            console.error('Error fetching turbines:', error);
        }
    };

    const override: CSSProperties = {
        position: 'absolute',
        top: '25px',
        left: '25px',
        width: '50px',
        height: '50px',
    };

    return (
        <>
            {windmillsLoading
                ? <ClipLoader
                    color={'#ffffff'}
                    loading={windmillsLoading}
                    cssOverride={override}
                    size={150}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
                : <FarmMenu farms={farms} onFarmSelect={handleFarmSelect} />
            }
            <div ref={mountRef}>
                {hoverText.visible && (
                    <div
                        style={{
                            position: 'absolute',
                            left: hoverText.x,
                            top: hoverText.y,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            padding: '5px',
                            borderRadius: '5px',
                        }}
                        dangerouslySetInnerHTML={{ __html: hoverText.content }}
                    />
                )}
            </div>
            <ControlPanel />
        </>
    );
};

export default Scene;
