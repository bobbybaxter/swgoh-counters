const fs = require('fs');
const path = require('path');

module.exports = ({ database, log }) => () => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/deleteAll.sql')).toString();

  return new Promise((res, rej) => {
    database.query(sql, (error, results) => {
      if (error) { rej(error); }
      log.info('zeta table truncated');
      res('ok');
    });
  }).catch((err) => {
    log.error(err.message);
    throw err;
  });
};
