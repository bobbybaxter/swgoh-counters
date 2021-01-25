const fs = require('fs');
const path = require('path');

module.exports = async ({ database, log }) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/getVersionDate.sql')).toString();

  return new Promise((res, rej) => {
    database.query(sql, (error, results) => {
      if (error) { rej(error); }

      const parsedResults = JSON.parse(JSON.stringify(results));
      if (!parsedResults.length) {
        return rej(new Error("Squads don't exist"));
      }

      return res(parsedResults[0]);
    });
  }).catch((e) => {
    log.error(e.message);
    throw e;
  });
};
