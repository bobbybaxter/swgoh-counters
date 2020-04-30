const axios = require('axios');

module.exports = app => async function getAllCounters() {
  await axios.get('https://api.sheety.co/e505ae20-ec5b-46e8-a86f-7149b9823b64');
};
