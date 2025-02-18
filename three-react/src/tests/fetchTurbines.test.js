import { fetchTurbines } from '../utils/api';

global.fetch = jest.fn();

describe('fetchTurbines', () => {
    beforeEach(() => {
        fetch.mockClear();
        process.env.REACT_APP_API_URL = 'http://localhost:8000/api';
    });

    it('successfully fetches turbines with components', async () => {
        const mockTurbines = {
            data: [
                { id: 1, name: 'Turbine 1' },
                { id: 2, name: 'Turbine 2' },
            ]
        };

        const mockComponents = {
            data: [
                { id: 1, name: 'Component 1', component_type_id: 1 },
                { id: 2, name: 'Component 2', component_type_id: 2 },
            ]
        };

        const mockComponentType = {
            data: {
                id: 1,
                name: 'Type 1'
            }
        };

        fetch.mockImplementation((url) => {
            if (url.includes('/farms/1/turbines')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockTurbines)
                });
            } else if (url.includes('/turbines/1/components') || url.includes('/turbines/2/components')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockComponents)
                });
            } else if (url.includes('/component-types/')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockComponentType)
                });
            }
            return Promise.reject(new Error(`Unhandled URL: ${url}`));
        });

        const result = await fetchTurbines(1);

        const calls = fetch.mock.calls.map(call => call[0]);
        expect(calls[0]).toBe('http://localhost:8000/api/farms/1/turbines');

        const expectedResult = [
            {
                id: 1,
                name: 'Turbine 1',
                components: mockComponents.data.map(comp => ({
                    ...comp,
                    componentType: mockComponentType.data
                }))
            },
            {
                id: 2,
                name: 'Turbine 2',
                components: mockComponents.data.map(comp => ({
                    ...comp,
                    componentType: mockComponentType.data
                }))
            }
        ];

        expect(result).toEqual(expectedResult);
    });

    it('returns default turbines when API call fails', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 500
            })
        );

        const result = await fetchTurbines(1);

        expect(result).toEqual([
            { id: 1, name: 'Default Turbine 1', components: [] },
            { id: 2, name: 'Default Turbine 2', components: [] },
        ]);
    });
});
