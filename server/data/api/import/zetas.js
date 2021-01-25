const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

module.exports = async ({ database }, characterId, name) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/zetas.sql')).toString();
  const id = nanoid();

  const variables = [id, name, characterId];

  const response = new Promise((res, rej) => {
    database.query(sql, variables, (error, results) => {
      if (error) { return rej(error); }
      return res('ok');
    });
  });

  try {
    return await response;
  } catch (err) {
    throw new Error(err);
  }
};
