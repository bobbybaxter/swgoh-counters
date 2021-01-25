const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

module.exports = async ({ database, log }, {
  opponentSquadId,
  counterSquadId,
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
  const sql = fs.readFileSync(path.join(__dirname, './sql/create.sql')).toString();
  const versionId = nanoid();
  const counterId = nanoid();

  const versionVariables = [
    versionId,
    counterId,
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
    counterId,
    opponentSquadId,
    counterSquadId,
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

              return log.info(`CounterVersion for ${counterId} successfully updated.`);
            });

            return '';
          });

          log.info(`Counter for ${counterId} successfully created.`);
          connection.release();
          return res('ok');
        });
      });
    });
  }).catch((e) => {
    log.error(e.message);
    throw e;
  });
};
