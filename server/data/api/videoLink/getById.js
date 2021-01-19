const fs = require('fs');
const path = require('path');

module.exports = async ({ database }, id) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/getById.sql')).toString();

  const response = new Promise((res, rej) => {
    database.query(sql, id, (error, results) => {
      if (error) { rej(error); }
      if (!results || (results && !results.length)) { return rej(new Error("Video link doesn't exist")); }
      return res(JSON.parse(JSON.stringify(results[0])));
    });
  });

  try {
    return await response;
  } catch (err) {
    return new Error(err);
  }
};
