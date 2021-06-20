/* eslint-disable max-len */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
const _ = require('lodash');

module.exports = (origObj, newObj) => {
  function changes(newObj, origObj) {
    let arrayIndexCounter = 0;
    return _.transform(newObj, (result, value, key) => {
      if (!_.isEqual(value, origObj[key])) {
        const resultKey = _.isArray(origObj) ? arrayIndexCounter += 1 : key;
        result[resultKey] = (_.isObject(value) && _.isObject(origObj[key])) ? changes(value, origObj[key]) : value;
      }
    });
  }
  return changes(newObj, origObj);
};
