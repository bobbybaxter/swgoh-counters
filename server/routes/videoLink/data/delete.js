const fs = require('fs');
const path = require('path');

module.exports = ({ database, log }) => (id) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/delete.sql')).toString();

  return new Promise((res, rej) => {
    database.query(sql, id, (error, results) => {
      if (error) { rej(error); }
      if (results.affectedRows === 0) {
        rej(new Error('VideoLink does not exist.'));
      }
      log.info(`VideoLink and VideoLinkVersion for ${id} successfully deleted.`);
      return res('ok');
    });
  }).catch((err) => {
    log.error(err.message);
    throw err;
  });
};
