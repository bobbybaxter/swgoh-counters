const fs = require('fs');
const path = require('path');

module.exports = ({ database, log }) => variables => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/getVariations.sql')).toString();

  return new Promise((res, rej) => {
    database.query(sql, variables, (error, results) => {
      if (error) { rej(error); }

      if (!results || (results && !results.length)) {
        log.warn(`Counter doesn't exist for ${variables[0]} - ${variables[1]} v ${variables[2]}`);
        return res({});
      }

      return res(JSON.parse(JSON.stringify(results)));
    });
  }).catch(err => {
    throw err;
  });
};
