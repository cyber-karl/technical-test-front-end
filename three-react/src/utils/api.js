const api = process.env.REACT_APP_API_URL;
export const componentTypeCache = {};

export async function fetchFarms() {
    try {
        const response = await fetch(api + '/farms');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const farms = await response.json();
        return farms.data;
    } catch (error) {
        console.error('Error fetching farms:', error);
        return [
            { id: 1, name: 'Default Farm 1' },
            { id: 2, name: 'Default Farm 2' },
        ];
    }
}

export async function fetchTurbines(farmId) {
    try {
        const response = await fetch(api + `/farms/${farmId}/turbines`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const turbines = await response.json();

        return await Promise.all(
            turbines.data.map(async (turbine) => {
                const components = await fetchComponents(turbine.id);
                return {...turbine, components};
            })
        );
    } catch (error) {
        console.error('Error fetching turbines:', error);
        return [
            { id: 1, name: 'Default Turbine 1', components: [] },
            { id: 2, name: 'Default Turbine 2', components: [] },
        ];
    }
}

export async function fetchComponents(turbineId) {
    try {
        const response = await fetch(api + `/turbines/${turbineId}/components`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const components = await response.json();

        const componentsWithTypes = [];
        for (const component of components.data) {
            const componentType = await fetchComponentType(component.component_type_id);
            componentsWithTypes.push({ ...component, componentType });

            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return componentsWithTypes;
    } catch (error) {
        console.error('Error fetching components:', error);
        return [];
    }
}

export async function fetchComponentType(componentTypeId) {
    if (componentTypeCache[componentTypeId]) {
        return componentTypeCache[componentTypeId];
    }

    try {
        const componentType = await fetchWithBackoff(api + `/component-types/${componentTypeId}`);
        componentTypeCache[componentTypeId] = componentType.data;
        return componentType.data;
    } catch (error) {
        console.error('Error fetching component type:', error);
        return null;
    }
}

const fetchWithBackoff = async (url, retries = 3, delay = 1000) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithBackoff(url, retries - 1, delay * 2);
        }
        throw error;
    }
};
