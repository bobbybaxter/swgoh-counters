const fs = require('fs');
const path = require('path');

module.exports = ({ database, log }) => ({ counterId }, {
  season,
  seen,
  winPerc,
  avgBanners,
}) => {
  const sql = fs.readFileSync(path.join(__dirname, './sql/updateByCounterId.sql')).toString();

  const variables = [
    season,
    seen,
    winPerc,
    avgBanners,
    counterId,
  ];

  return new Promise((res, rej) => {
    // gets a database connection
    database.getConnection((databaseConnectionError, connection) => {
      if (databaseConnectionError) {
        connection.release();
        rej(databaseConnectionError);
      }

      // begins a transaction
      connection.beginTransaction(transactionError => {
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

          return connection.commit(commitError => {
            if (commitError) {
              return connection.rollback(() => {
                connection.release();
                rej(commitError);
              });
            }

            return log.info(`CounterStats for ${counterId} successfully updated.`);
          });
        });

        connection.release();
        return res('ok');
      });
    });
  }).catch(err => {
    throw err;
  });
};
