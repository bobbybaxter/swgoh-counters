const fs = require('fs');
const path = require('path');

module.exports = ({ database, log }) => ({ id, name }) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/update.sql')).toString();

  const variables = [name, id];

  return new Promise((res, rej) => {
    database.query(sql, variables, (error, results) => {
      if (error) { return rej(error); }

      if (results.affectedRows === 0) {
        rej(new Error('Character was not updated.'));
      }

      return res('ok');
    });
  }).catch(err => {
    log.error(err.message);
    throw new Error(err);
  });
};
