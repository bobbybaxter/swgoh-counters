/* eslint-disable no-return-await */
const axios = require('axios');

module.exports = app => async (allyCode) => {
  const res = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://swgoh.gg/api/player/${allyCode}`)}`);

  if (res.data) {
    return JSON.parse(await res.data.contents).data;
  }

  return await res;
};
