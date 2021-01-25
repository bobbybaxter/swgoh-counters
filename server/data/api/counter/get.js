const fs = require('fs');
const path = require('path');

module.exports = async ({ database, log }) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/get.sql')).toString();

  const response = new Promise((res, rej) => {
    database.query(sql, (error, results) => {
      if (error) { rej(error); }

      const parsedResults = JSON.parse(JSON.stringify(results)) || {};
      if (!parsedResults.length) {
        rej(new Error("Counters don't exist"));
      }

      res(parsedResults);
    });
  }).catch((e) => {
    log.error(e.message);
    throw e;
  });

  await response;
};
