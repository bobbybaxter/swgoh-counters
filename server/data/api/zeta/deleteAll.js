const fs = require('fs');
const path = require('path');

module.exports = async ({ database }) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/deleteAll.sql')).toString();

  const response = new Promise((res, rej) => {
    database.query(sql, (error, results) => {
      if (error) { rej(error); }
      console.info('zeta table truncated');
      return res('ok');
    });
  });

  try {
    return await response;
  } catch (err) {
    return new Error(err);
  }
};
