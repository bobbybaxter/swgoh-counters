const fs = require('fs');
const path = require('path');

module.exports = ({ database, log }) => () => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/get.sql')).toString();

  return new Promise((res, rej) => {
    database.query(sql, (error, results) => {
      if (error) { rej(error); }

      const parsedResults = JSON.parse(JSON.stringify(results));
      if (!parsedResults.length) {
        rej(new Error("Zetas don't exist"));
      }

      res(parsedResults);
    });
  }).catch((err) => {
    log.error(err.message);
    throw err;
  });
};
