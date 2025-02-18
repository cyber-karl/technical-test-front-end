import { fetchComponentType, componentTypeCache } from '../utils/api';

global.fetch = jest.fn();
jest.setTimeout(10000);

describe('fetchComponentType', () => {
    beforeEach(() => {
        fetch.mockClear();
        process.env.REACT_APP_API_URL = 'http://localhost:8000/api';
        for (let key in componentTypeCache) {
            delete componentTypeCache[key];
        }
    });

    it('successfully fetches component type', async () => {
        const mockComponentType = {
            data: {
                id: 1,
                name: 'Type 1'
            }
        };

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockComponentType)
            })
        );

        const result = await fetchComponentType(1);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/component-types/1');
        expect(result).toEqual(mockComponentType.data);
    });

    it('returns null when API call fails', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 500
            })
        );

        const result = await fetchComponentType(1);

        expect(result).toBeNull();
    });

    it('uses cached value for repeated requests', async () => {
        const mockComponentType = {
            data: {
                id: 1,
                name: 'Type 1'
            }
        };

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockComponentType)
            })
        );

        await fetchComponentType(1);
        await fetchComponentType(1);

        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
