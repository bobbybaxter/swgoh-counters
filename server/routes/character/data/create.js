const fs = require('fs');
const path = require('path');

module.exports = ({ log, database }) => ({ id, name }) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/create.sql')).toString();

  const variables = [id, name];

  return new Promise((res, rej) => {
    database.query(sql, variables, (error, results) => {
      if (error) { rej(error); }
      if (results && results.affectedRows === 1) {
        log.info(`${name} successfully created with id: ${id}`);
      }
      res('ok');
    });
  }).catch(err => {
    if (err.code === 'ER_DUP_ENTRY') {
      return ('ok');
    }
    throw err;
  });
};
