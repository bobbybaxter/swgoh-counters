/* eslint-disable no-prototype-builtins */
const axios = require('axios');
const _ = require('lodash');

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
    const res = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${size}Export?key=${apiKey}`);
    const allLeaderSquads = parseGoogleSheet(res.data.values);
    const leadersNormal = _.uniqBy(allLeaderSquads.map(leader => ({
      id: leader.toon1Id,
      name: leader.toon1Name,
    })), 'id');

    const normalStubs = await data.getStubs('normal', leadersNormal, size);
    const normal = await Promise.all(normalStubs.map(async x => {
      const leaderSquadIds = allLeaderSquads
        .filter(y => y.toon1Id === x.toon1Id)
        .map(y => y.id);

      return ({
        ...x,
        squads: await data.getMultipleSquadsByIds(leaderSquadIds),
      });
    }));

    const resReverse = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${size}RExport?key=${apiKey}`);
    const allLeaderSquadsReverse = parseGoogleSheet(resReverse.data.values);
    const leadersReverse = _.uniqBy(allLeaderSquadsReverse.map(leader => ({
      id: leader.toon1Id,
      name: leader.toon1Name,
    })), 'id');

    const reverseStubs = await data.getStubs('reverse', leadersReverse, size);
    const reverse = await Promise.all(reverseStubs.map(async x => {
      const leaderSquadIds = allLeaderSquadsReverse
        .filter(y => y.toon1Id === x.toon1Id)
        .map(y => y.id);

      return ({
        ...x,
        squads: await data.getMultipleSquadsByIds(leaderSquadIds),
      });
    }));

    const squadStubs = {
      normal,
      reverse,
      leadersNormal,
      leadersReverse,
    };

    reply
      .type('application/json')
      .send(squadStubs);
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
          leadersNormal: {
            type: 'array',
            items: {
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
              },
            },
          },
          leadersReverse: {
            type: 'array',
            items: {
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
});
