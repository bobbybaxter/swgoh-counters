const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

module.exports = ({ database, log }) => ({ id }, {
  isHardCounter,
  battleType,
  counterStrategy,
  isToon2Req,
  isToon3Req,
  isToon4Req,
  isToon5Req,
  toon1Zetas,
  toon2Zetas,
  toon3Zetas,
  toon4Zetas,
  toon5Zetas,
  userId,
  username,
}) => {
  const versionSql = fs.readFileSync(path.join(__dirname, './sql/createVersion.sql')).toString();
  const sql = fs.readFileSync(path.join(__dirname, './sql/update.sql')).toString();
  const versionId = nanoid();

  const versionVariables = [
    versionId,
    id,
    isHardCounter,
    battleType,
    counterStrategy,
    isToon2Req,
    isToon3Req,
    isToon4Req,
    isToon5Req,
    toon1Zetas,
    toon2Zetas,
    toon3Zetas,
    toon4Zetas,
    toon5Zetas,
    new Date().toISOString(),
    userId,
    username,
  ];

  const variables = [
    versionId,
    id,
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

        connection.query(versionSql, versionVariables, (versionError, versionResults) => {
          if (versionError) {
            return connection.rollback(() => {
              connection.release();
              rej(versionError);
            });
          }

          connection.query(sql, variables, (sqlError, sqlResults) => {
            if (sqlError) {
              return connection.rollback(() => {
                connection.release();
                rej(sqlError);
              });
            }

            return connection.commit((commitError) => {
              if (commitError) {
                return connection.rollback(() => {
                  connection.release();
                  rej(commitError);
                });
              }

              return log.info(`Counter for ${id} successfully updated.`);
            });
          });

          log.info(`Counter Version for ${id} successfully added.`);
          connection.release();
          return res('ok');
        });
      });
    });
  }).catch((err) => {
    throw err;
  });
};
