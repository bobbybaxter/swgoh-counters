const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

module.exports = ({ database, log }) => ({
  counterId,
  season,
  seen,
  winPerc,
  avgBanners,
}) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/create.sql')).toString();
  const id = nanoid();

  const variables = [
    id,
    counterId,
    season,
    seen,
    winPerc,
    avgBanners,
  ];

  return new Promise((res, rej) => {
    database.getConnection((databaseConnectionError, connection) => {
      if (databaseConnectionError) {
        connection.release();
        rej(databaseConnectionError);
      }

      connection.beginTransaction(transactionError => {
        if (transactionError) {
          connection.release();
          rej(transactionError);
        }

        connection.query(sql, variables, (versionError, versionResults) => {
          if (versionError) {
            return connection.rollback(() => {
              connection.release();
              rej(versionError);
            });
          }

          return connection.commit(commitError => {
            if (commitError) {
              return connection.rollback(() => {
                connection.release();
                rej(commitError);
              });
            }

            return log.info(`CounterStats for ${id} successfully created.`);
          });
        });

        connection.release();
        return res(id);
      });
    });
  }).catch(err => {
    throw err;
  });
};
