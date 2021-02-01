const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

module.exports = ({ database, log }) => ({
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
  const sql = fs.readFileSync(path.join(__dirname, './sql/create.sql')).toString();
  const versionId = nanoid();
  const squadId = nanoid();

  const versionVariables = [
    versionId,
    squadId,
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
    squadId,
    versionId,
  ];

  return new Promise((res, rej) => {
    database.getConnection((databaseConnectionError, connection) => {
      if (databaseConnectionError) {
        connection.release();
        rej(databaseConnectionError);
      }

      connection.beginTransaction((transactionError) => {
        if (transactionError) {
          connection.release();
          rej(transactionError);
        }

        connection.query(sql, variables, (sqlError, sqlResults) => {
          if (sqlError) {
            return connection.rollback(() => {
              connection.release();
              rej(sqlError);
            });
          }

          connection.query(versionSql, versionVariables, (versionError, versionResults) => {
            if (versionError) {
              return connection.rollback(() => {
                connection.release();
                rej(versionError);
              });
            }

            connection.commit((commitError) => {
              if (commitError) {
                return connection.rollback(() => {
                  connection.release();
                  rej(commitError);
                });
              }

              return log.info(`SquadVersion for ${squadId} successfully updated.`);
            });

            return '';
          });

          log.info(`Squad for ${squadId} successfully created.`);
          connection.release();
          return res(squadId);
        });
      });
    });
  }).catch((e) => {
    log.error(e.message);
    throw e;
  });
};
