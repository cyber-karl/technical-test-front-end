import { Vector3 } from "three";

const hoverText = document.createElement('div');
hoverText.style.position = 'absolute';
hoverText.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
hoverText.style.color = 'white';
hoverText.style.padding = '5px';
hoverText.style.borderRadius = '5px';
hoverText.style.display = 'none';
document.body.appendChild(hoverText);

export async function updateHoverText(
    raycaster,
    mouse,
    camera,
    windmills,
    farms,
    turbines,
    controls,
    mouseX,
    mouseY
) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(windmills, true);

    if (intersects.length > 0 && !controls.isLocked) {
        const intersected = intersects[0].object;
        const worldPosition = new Vector3();
        intersected.getWorldPosition(worldPosition);

        let windmill = intersected;
        while (windmill.parent && !windmill.userData.farmId) {
            windmill = windmill.parent;
        }

        if (windmill) {
            const farm = farms.find(f => f.id === windmill.userData.farmId);
            const farmTurbines = turbines.filter(turbine => turbine.farm_id === farm.id);

            hoverText.style.display = 'block';
            hoverText.style.left = `${mouseX + 16}px`;
            hoverText.style.top = `${mouseY + 16}px`;
            let inner = `
                <strong>Farm:</strong> ${farm.name}<br>
                <strong>Location:</strong> (
                    ${worldPosition.x.toFixed(1)},
                    ${worldPosition.y.toFixed(1)},
                    ${worldPosition.z.toFixed(1)}
                )<br>
                <strong>ID:</strong> ${farm.id}
            `;

            if (farmTurbines.length > 0) {
                inner += `<br><strong>Turbines:</strong>`;
                farmTurbines.forEach(turbine => {
                    inner += `
                        <br> - ${turbine.name}
                    `;
                });
            } else {
                inner += `<br><strong>Turbines:</strong> None`;
            }

            hoverText.innerHTML = inner;
        } else {
            hoverText.style.display = 'none';
        }
    } else {
        hoverText.style.display = 'none';
    }
}
