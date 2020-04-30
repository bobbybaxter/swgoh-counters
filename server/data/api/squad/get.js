const axios = require('axios');

const { squadSheet } = require('../../../.config.json');

module.exports = app => new Promise((resolve, reject) => {
  axios.get(squadSheet)
    .then(res => resolve(res.data))
    .catch(err => reject(err));
});
