const fs = require('fs');
const path = require('path');

module.exports = ({ database, log }) => (id) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/getById.sql')).toString();

  return new Promise((res, rej) => {
    database.query(sql, id, (error, results) => {
      if (error) { rej(error); }

      if (!results || (results && !results.length)) {
        log.warn(`Character doesn't exist for id: ${id}`);
        return res({});
      }

      res(JSON.parse(JSON.stringify(results[0])));
    });
  }).catch((err) => {
    log.error(err.message);
    throw err;
  });
};
