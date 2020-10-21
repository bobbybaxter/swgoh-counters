const fs = require('fs');
const path = require('path');

module.exports = async ({ database }, [{ id }], { name }) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/update.sql')).toString();

  const variables = [name, id];

  const response = new Promise((res, rej) => {
    database.query(sql, variables, (error, results) => {
      if (error) { return rej(error); }

      if (results.affectedRows === 0) {
        rej(new Error('Character was not updated.'));
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
