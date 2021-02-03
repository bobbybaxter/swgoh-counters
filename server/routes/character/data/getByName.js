const fs = require('fs');
const path = require('path');

module.exports = ({ database, log }) => (name) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/getByName.sql')).toString();

  return new Promise((res, rej) => {
    database.query(sql, name, (error, results) => {
      if (error) { rej(error); }

      if (!results || (results && !results.length)) {
        return res({
          id: 'BLANK',
          name: 'Blank',
        });
      }

      return res(JSON.parse(JSON.stringify(results[0])));
    });
  }).catch(err => ({
    id: 'BLANK',
    name: 'Blank',
  }));
};
