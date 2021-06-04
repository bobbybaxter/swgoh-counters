const axios = require('axios');

const parseGoogleSheet = require('helpers/parseGoogleSheet');

const { sheetId, apiKey } = require('.config.json');

module.exports = () => async () => {
  const unparsedCounters = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Counters?key=${apiKey}`);
  const parsedCounters = parseGoogleSheet(unparsedCounters.data.values);

  return parsedCounters;
};
