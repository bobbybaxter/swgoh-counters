const fs = require('fs');
const path = require('path');

module.exports = async ({ database, log }, id) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/getById.sql')).toString();

  return new Promise((res, rej) => {
    database.query(sql, id, (error, results) => {
      if (error) { rej(error); }

      if (!results || (results && !results.length)) { return rej(new Error("Squad doesn't exist")); }

      return res(JSON.parse(JSON.stringify(results[0])));
    });
  }).catch((e) => {
    log.error(e.message);
    throw e;
  });
};
