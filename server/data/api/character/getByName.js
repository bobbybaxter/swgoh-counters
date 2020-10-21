const fs = require('fs');
const path = require('path');

module.exports = async ({ database }, name) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/getByName.sql')).toString();

  const response = new Promise((res, rej) => {
    database.query(sql, name, (error, results) => {
      if (error) { rej(error); }

      const parsedResults = JSON.parse(JSON.stringify(results));
      if (!parsedResults.length) {
        return rej(new Error("Character doesn't exist"));
      }

      return res(parsedResults[0]);
    });
  });

  try {
    return await response;
  } catch (err) {
    return {
      id: 'BLANK',
      name: 'Blank',
    };
  }
};
