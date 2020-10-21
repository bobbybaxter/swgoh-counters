const fs = require('fs');
const path = require('path');

module.exports = async ({ database }, id) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/getNormalSquads.sql')).toString();

  const response = new Promise((res, rej) => {
    database.query(sql, id, (error, results) => {
      if (error) { rej(error); }
      if (!results.length) { return rej(new Error("Squads don't exist")); }
      return res(JSON.parse(JSON.stringify(results)));
    });
  });

  try {
    return await response;
  } catch (err) {
    return new Error(err);
  }
};
