const axios = require('axios');

const { counterSheet } = require('../../../.config.json');

module.exports = app => new Promise((resolve, reject) => {
  axios.get(counterSheet)
    .then(res => resolve(res.data))
    .catch(err => reject(err));
});
