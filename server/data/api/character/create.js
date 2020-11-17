const fs = require('fs');
const path = require('path');

module.exports = async ({ database }, { id, name }) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/create.sql')).toString();

  const variables = [id, name];

  const response = new Promise((res, rej) => {
    database.query(sql, variables, (error, results) => {
      if (error) { return rej(error); }
      console.info(`${name} successfully created with id: ${id}`);
      return res('ok');
    });
  });

  try {
    return await response;
  } catch (err) {
    return new Error(err);
  }
};
