const fs = require('fs');
const path = require('path');

module.exports = async ({ database }, id) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/getById.sql')).toString();

  const response = new Promise((res, rej) => {
    database.query(sql, id, (error, results) => {
      if (error) { rej(error); }

      const parsedResults = JSON.parse(JSON.stringify(results));
      if (!parsedResults.length) {
        return rej(new Error("Characters doesn't exist"));
      }

      return res(parsedResults);
    });
  });

  try {
    return await response;
  } catch (err) {
    return new Error(err);
  }
};
