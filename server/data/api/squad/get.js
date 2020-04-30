const axios = require('axios');

module.exports = app => async function getAllSquads() {
  await axios.get('https://api.sheety.co/a710e43e-2721-45bb-b722-dafafea5b152');
};
