// const { server } = require("spec/harness");
const mockAxios = require('axios');

const getCounters = require('routes/counter/data/get');

describe('GET /api/counter', () => {
  it('successfully gets data from counter sheet', async () => {
    const res = {
      data: {
        characters: {
          name: 'character1',
          power: 12345,
        },
      },
    };

    mockAxios.get.mockResolvedValue(res);

    const counters = await getCounters();

    await expect(counters).toEqual(res.data);
  });
});
