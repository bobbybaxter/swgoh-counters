const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

module.exports = async ({ database }, {
  opponentSquadId,
  counterSquadId,
  isHardCounter,
  battleType,
  description,
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
    new Date().toISOString(),
    'user1',
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

              return console.log(`Counter for ${counterId} successfully updated.`);
            });

            return '';
          });

          console.log(`Counter Version for ${counterId} successfully created.`);
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
