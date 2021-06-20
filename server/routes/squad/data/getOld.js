const axios = require('axios');

const parseGoogleSheet = require('helpers/parseGoogleSheet');

const { sheetId, apiKey } = require('.config.json');

module.exports = ({ database }) => async () => {
  const unparsedSquads = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Teams?key=${apiKey}`);
  const parsedSquads = parseGoogleSheet(unparsedSquads.data.values);

  return parsedSquads;
};
