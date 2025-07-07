import { Vector3 } from "three";

export function updateHoverText(
    raycaster,
    mouse,
    camera,
    windmills,
    farms,
    turbines,
    controls,
    mouseX,
    mouseY,
    setHoverText
) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(windmills, true);
    if (farms.length > 0) {
        console.log("Farms");
    }
    if (turbines.length > 0) {
        console.log("turbines");
    }
    if (windmills.length > 0) {
        console.log("windmills");
    }
    if (intersects.length > 0 && !controls.isLocked) {
        const intersected = intersects[0].object;
        const worldPosition = new Vector3();
        intersected.getWorldPosition(worldPosition);

        let windmill = intersected;
        while (windmill.parent && !windmill.userData.farmId) {
            windmill = windmill.parent;
        }

        if (windmill) {
            const farm = farms.find(f => f.id === Number(windmill.userData.farmId));
            const turbine = turbines.find(t => t.id === Number(windmill.userData.turbineId));

            if (farm && turbine) {
                let inner = `
                    <strong>Farm:</strong> ${farm.name}<br>
                    <strong>Turbine ID:</strong> ${turbine.id}<br>
                    <strong>Location:</strong> (
                        ${worldPosition.x.toFixed(1)},
                        ${worldPosition.y.toFixed(1)},
                        ${worldPosition.z.toFixed(1)}
                    )<br>
                `;

                if (turbine.components.length > 0) {
                    inner += `<strong>Components:</strong>`;
                    turbine.components.forEach(component => {
                        inner += `<br> - ${component.componentType?.name ?? "Error"}`;
                    });
                } else {
                    inner += `<br> None`;
                }

                setHoverText({
                    visible: true,
                    content: inner,
                    x: mouseX + 16,
                    y: mouseY + 16,
                });
            } else {
                setHoverText({ visible: false });
            }
        } else {
            setHoverText({ visible: false });
        }
    } else {
        setHoverText({ visible: false });
    }
}
