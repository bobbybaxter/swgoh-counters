const fs = require('fs');
const path = require('path');

module.exports = async ({ database, log }) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/deleteAll.sql')).toString();

  const response = new Promise((res, rej) => {
    database.query(sql, (error, results) => {
      if (error) { rej(error); }
      log.info('zeta table truncated');
      return res('ok');
    });
  });

  try {
    return await response;
  } catch (err) {
    throw new Error(err);
  }
};
