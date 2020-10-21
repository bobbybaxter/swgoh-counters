/* eslint-disable no-prototype-builtins */
const renameKeys = (keysMap, objToMap) => {
  const obj = { ...objToMap };
  const test = Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...{ [keysMap[key] || key]: obj[key] },
    }),
    {},
  );

  if (!test.hasOwnProperty('description')) { test.description = ''; }
  if (!test.hasOwnProperty('video')) { test.video = ''; }
  if (test.hasOwnProperty('leaderReq')) { test.leaderReq = (test.leaderReq === 'TRUE'); }
  if (test.hasOwnProperty('toon2Req')) { test.toon2Req = (test.toon2Req === 'TRUE'); }
  if (test.hasOwnProperty('toon3Req')) { test.toon3Req = (test.toon3Req === 'TRUE'); }
  if (test.hasOwnProperty('toon4Req')) { test.toon4Req = (test.toon4Req === 'TRUE'); }
  if (test.hasOwnProperty('toon5Req')) { test.toon5Req = (test.toon5Req === 'TRUE'); }
  if (test.hasOwnProperty('stratNeeded')) { test.stratNeeded = (test.stratNeeded === 'TRUE'); }
  if (test.hasOwnProperty('isHardCounter')) { test.isHardCounter = (test.isHardCounter === 'TRUE'); }

  return test;
};

module.exports = function parseGoogleSheet(data) {
  const headers = data.shift();
  const valueRows = data.slice();
  return valueRows.map(valueRow => renameKeys(headers, valueRow));
};
