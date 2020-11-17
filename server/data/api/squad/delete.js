const fs = require('fs');
const path = require('path');

module.exports = async ({ database }, id) => {
  const versionSql = fs.readFileSync(path.join(__dirname, './sql/deleteVersions.sql')).toString();
  const sql = fs.readFileSync(path.join(__dirname, './sql/delete.sql')).toString();

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

        connection.query(sql, id, (sqlError, sqlResults) => {
          if (sqlError) {
            return connection.rollback(() => {
              connection.release();
              rej(sqlError);
            });
          }

          connection.query(versionSql, id, (versionError, versionResults) => {
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

              return console.info(`Counter Versions for ${id} successfully deleted.`);
            });

            return '';
          });

          console.info(`Counter for ${id} successfully deleted.`);
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
