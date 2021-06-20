/* eslint-disable no-prototype-builtins */
const axios = require('axios');

function parseGoogleSheet(data) {
  function renameKeys(keysMap, objToMap) {
    const obj = { ...objToMap };
    const keys = Object.keys(obj).reduce(
      (acc, key) => ({
        ...acc,
        ...{ [keysMap[key] || key]: obj[key] },
      }),
      {},
    );

    if (keys.hasOwnProperty('squad')) { keys.squad = keys.squad.split(','); }
    if (keys.hasOwnProperty('reqToons')) { keys.reqToons = keys.reqToons.split(','); }

    return keys;
  }

  const headers = data.shift();
  const valueRows = data.slice();
  return valueRows.map(valueRow => renameKeys(headers, valueRow));
}

const sheetId = process.env.GOOGLE_SHEET_ID;
const apiKey = process.env.GOOGLE_API_KEY;

module.exports = ({ data }) => ({
  method: 'GET',
  path: '/squad/stubs/:size',
  handler: async (request, reply) => {
    const { size } = request.params;

    async function buildStubs(stub, leaderSquads) {
      const leaderSquadIds = leaderSquads
        .filter(x => x.toon1Id === stub.toon1Id)
        .map(x => x.id);
      const squads = await data.getMultipleSquadsByIds(leaderSquadIds);

      return ({ ...stub, squads });
    }

    const res = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${size}Export?key=${apiKey}`);
    const allLeaderSquads = parseGoogleSheet(res.data.values);
    const normalStubs = await data.getStubs('normal', allLeaderSquads, size);
    const normal = await Promise.all(
      normalStubs.map(async stub => buildStubs(stub, allLeaderSquads)),
    );

    const resReverse = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${size}RExport?key=${apiKey}`);
    const allLeaderSquadsReverse = parseGoogleSheet(resReverse.data.values);
    const reverseStubs = await data.getStubs('reverse', allLeaderSquadsReverse, size);
    const reverse = await Promise.all(
      reverseStubs.map(async stub => buildStubs(stub, allLeaderSquadsReverse)),
    );

    reply
      .type('application/json')
      .send({ normal, reverse });
  },
  schema: {
    params: {
      size: { type: 'string' },
    },
    response: {
      '2xx': {
        type: 'object',
        properties: {
          normal: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                toon1Id: { type: 'string' },
                toon1Name: { type: 'string' },
                squads: { type: 'array' },
                latestCounterVersion: { type: 'string' },
              },
            },
          },
          reverse: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                toon1Id: { type: 'string' },
                toon1Name: { type: 'string' },
                squads: { type: 'array' },
                latestCounterVersion: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
});
