const api = import.meta.env.VITE_API_URL;

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

export async function fetchTurbines() {
    try {
        const response = await fetch(api + '/turbines');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const turbines = await response.json();
        return turbines.data;
    } catch (error) {
        console.error('Error fetching turbines:', error);
        return [
            { id: 1, name: 'Default Turbine 1' },
            { id: 2, name: 'Default Turbine 2' },
        ];
    }
}
