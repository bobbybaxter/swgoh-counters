const fs = require('fs');
const path = require('path');

module.exports = async ({ database }, id) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/delete.sql')).toString();

  const response = new Promise((res, rej) => {
    database.query(sql, id, (error, results) => {
      if (error) { return rej(error); }
      if (results.affectedRows === 0) {
        rej(new Error('Character does not exist.'));
      }
      return res('ok');
    });
  });

  try {
    return await response;
  } catch (err) {
    return new Error(err);
  }
};
