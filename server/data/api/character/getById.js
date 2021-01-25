const fs = require('fs');
const path = require('path');

module.exports = ({ database, log }, id) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/getById.sql')).toString();

  return new Promise((res, rej) => {
    database.query(sql, id, (error, results) => {
      if (error) { rej(error); }

      const parsedResults = JSON.parse(JSON.stringify(results)) || {};
      if (!parsedResults.length) {
        rej(new Error("Character doesn't exist"));
      }

      res(parsedResults[0]);
    });
  }).catch((err) => {
    log.error(err.message);
    throw err;
  });
};
