import { fetchFarms } from '../utils/api';

global.fetch = jest.fn();

describe('fetchFarms', () => {
    beforeEach(() => {
        fetch.mockClear();
        process.env.REACT_APP_API_URL = 'http://localhost:8000/api';
    });

    it('successfully fetches farms data', async () => {
        const mockFarms = {
            data: [
                { id: 1, name: 'Farm 1' },
                { id: 2, name: 'Farm 2' },
            ]
        };

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockFarms)
            })
        );

        const result = await fetchFarms();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/farms');
        expect(result).toEqual(mockFarms.data);
    });

    it('returns default farms when API call fails', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 500
            })
        );

        const result = await fetchFarms();

        expect(result).toEqual([
            { id: 1, name: 'Default Farm 1' },
            { id: 2, name: 'Default Farm 2' },
        ]);
    });
});
