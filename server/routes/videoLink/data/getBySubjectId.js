const fs = require('fs');
const path = require('path');

module.exports = ({ database, log }) => (id) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/getBySubjectId.sql')).toString();

  return new Promise((res, rej) => {
    database.query(sql, id, (error, results) => {
      if (error) { rej(error); }
      if (!results || (results && !results.length)) { return res([]); }
      return res(JSON.parse(JSON.stringify(results)));
    });
  }).catch((err) => {
    throw err;
  });
};
