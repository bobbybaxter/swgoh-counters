const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

module.exports = async ({ database }, { id }, {
  name,
  description,
  generalStrategy,
  toon1Id,
  toon2Id,
  toon3Id,
  toon4Id,
  toon5Id,
  userId,
  username,
}) => {
  const versionSql = fs.readFileSync(path.join(__dirname, './sql/createVersion.sql')).toString();
  const sql = fs.readFileSync(path.join(__dirname, './sql/update.sql')).toString();
  const versionId = nanoid();

  const versionVariables = [
    versionId,
    id,
    name,
    description,
    generalStrategy,
    toon1Id,
    toon2Id,
    toon3Id,
    toon4Id,
    toon5Id,
    new Date().toISOString(),
    userId,
    username,
  ];

  const variables = [
    versionId,
    id,
  ];

  const response = new Promise((res, rej) => {
    // gets a database connection
    database.getConnection((databaseConnectionError, connection) => {
      if (databaseConnectionError) {
        connection.release();
        rej(databaseConnectionError);
      }

      // begins a transaction
      connection.beginTransaction((transactionError) => {
        if (transactionError) {
          connection.release();
          rej(transactionError);
        }

        // adds a new version of the squad
        connection.query(versionSql, versionVariables, (versionError, versionResults) => {
          if (versionError) {
            return connection.rollback(() => {
              connection.release();
              rej(versionError);
            });
          }

          // updates the squad with the new squad version
          connection.query(sql, variables, (sqlError, sqlResults) => {
            if (sqlError) {
              return connection.rollback(() => {
                connection.release();
                rej(sqlError);
              });
            }

            connection.commit((commitError) => {
              if (commitError) {
                return connection.rollback(() => {
                  connection.release();
                  rej(commitError);
                });
              }

              return console.info(`Squad for ${id} successfully updated.`);
            });

            return '';
          });

          console.info(`Squad Version for ${id} successfully added.`);
          connection.release();
          return res('ok');
        });
      });
    });
  });

  try {
    return await response;
  } catch (err) {
    return new Error(err);
  }
};
