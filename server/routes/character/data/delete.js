const fs = require('fs');
const path = require('path');

module.exports = ({ database, log }) => (id) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/delete.sql')).toString();

  return new Promise((res, rej) => {
    database.query(sql, id, (error, results) => {
      if (error) { return rej(error); }
      if (results.affectedRows === 0) {
        rej(new Error('Character does not exist.'));
      }
      return res('ok');
    });
  }).catch((err) => {
    log.error(err.message);
    throw err;
  });
};
