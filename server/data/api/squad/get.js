const fs = require('fs');
const path = require('path');

module.exports = async ({ database }) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/get.sql')).toString();

  const response = new Promise((res, rej) => {
    database.query(sql, (error, results) => {
      if (error) { rej(error); }

      const parsedResults = JSON.parse(JSON.stringify(results)) || {};
      if (!parsedResults.length) {
        return rej(new Error("Squads don't exist"));
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
