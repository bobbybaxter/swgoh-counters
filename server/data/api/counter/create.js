const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

module.exports = async ({ database }, {
  opponentSquadId,
  counterSquadId,
  isHardCounter,
  battleType,
  description,
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
    description,
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

  const response = new Promise((res, rej) => {
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

            connection.commit((commitError) => {
              if (commitError) {
                return connection.rollback(() => {
                  connection.release();
                  rej(commitError);
                });
              }

              return console.info(`Counter for ${counterId} successfully updated.`);
            });

            return '';
          });

          console.info(`Counter Version for ${counterId} successfully created.`);
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
