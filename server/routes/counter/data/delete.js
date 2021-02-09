const fs = require('fs');
const path = require('path');

module.exports = ({ database }) => (id) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/delete.sql')).toString();

  return new Promise((res, rej) => {
    database.query(sql, id, (error, results) => {
      if (error) { rej(error); }
      if (results.affectedRows === 0) {
        rej(new Error('Counter does not exist.'));
      }
      return res('ok');
    });
  }).catch((err) => {
    throw err;
  });
};
