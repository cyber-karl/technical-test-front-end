import {componentTypeCache, fetchComponents, fetchComponentType} from '../utils/api';

global.fetch = jest.fn();
jest.setTimeout(20000);

jest.mock('../utils/api', () => ({
    ...jest.requireActual('../utils/api'),
    fetchComponentType: jest.fn(async (id) => ({ id, name: `Type ${id}` })),
}));

describe('fetchComponents', () => {
    beforeEach(() => {
        fetch.mockClear();
        fetchComponentType.mockClear();
        process.env.REACT_APP_API_URL = 'http://localhost:8000/api';
        for (let key in componentTypeCache) {
            delete componentTypeCache[key];
        }
    });

    it('successfully fetches components with their types', async () => {
        const mockComponents = {
            data: [
                { id: 1, name: 'Component 1', component_type_id: 1 },
                { id: 2, name: 'Component 2', component_type_id: 2 },
            ]
        };

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockComponents),
            })
        );

        fetchComponentType.mockImplementation(async (id) => {
            if (id === 1) return { id: 1, name: 'Type 1' };
            if (id === 2) return { id: 2, name: 'Type 2' };
            return null;
        });

        const result = await fetchComponents(1);

        expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/turbines/1/components');

        expect(fetchComponentType).toHaveBeenCalledTimes(2);
        expect(fetchComponentType).toHaveBeenCalledWith(1);
        expect(fetchComponentType).toHaveBeenCalledWith(2);

        expect(result).toEqual([
            { id: 1, name: 'Component 1', component_type_id: 1, componentType: { id: 1, name: 'Type 1' } },
            { id: 2, name: 'Component 2', component_type_id: 2, componentType: { id: 2, name: 'Type 2' } },
        ]);
    });

    it('returns empty array when API call fails', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 500
            })
        );

        const result = await fetchComponents(1);

        expect(result).toEqual([]);
    });
});
