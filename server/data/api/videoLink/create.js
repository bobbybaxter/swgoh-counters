const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

module.exports = async ({ database }, {
  subjectId,
  title,
  link,
  userId,
  username,
}) => {
  const versionSql = fs.readFileSync(path.join(__dirname, './sql/createVersion.sql')).toString();
  const sql = fs.readFileSync(path.join(__dirname, './sql/create.sql')).toString();
  const versionId = nanoid();
  const videoLinkId = nanoid();

  const versionVariables = [
    versionId,
    videoLinkId,
    title,
    link,
    new Date().toISOString(),
    userId,
    username,
  ];

  const variables = [
    videoLinkId,
    subjectId,
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

              return console.info(`VideoLinkVersion for ${videoLinkId} successfully updated.`);
            });

            return '';
          });

          console.info(`VideoLink for ${videoLinkId} successfully created.`);
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
