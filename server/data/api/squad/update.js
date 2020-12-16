const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

module.exports = async ({ database }, squadToUpdate, {
  name,
  description,
  counterStrategy,
  toon1Id,
  toon2Id,
  toon3Id,
  toon4Id,
  toon5Id,
}) => {
  let oldSquadId;
  let variables;
  let nameChangeVariables;
  let { id } = squadToUpdate;
  const originalName = squadToUpdate.name;
  const nameChangeSql = fs.readFileSync(path.join(__dirname, './sql/squadNameChange.sql')).toString();
  const versionSql = fs.readFileSync(path.join(__dirname, './sql/createVersion.sql')).toString();
  const sql = fs.readFileSync(path.join(__dirname, './sql/update.sql')).toString();
  const versionId = nanoid();
  const isNameChange = name !== originalName;

  if (isNameChange) {
    oldSquadId = id;

    id = name.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .split(' ')
      .join('_');

    nameChangeVariables = [id, oldSquadId];
    variables = [id, name, versionId, oldSquadId];
  } else {
    variables = [id, name, versionId, id];
  }

  const versionVariables = [
    versionId,
    id,
    description,
    counterStrategy,
    toon1Id,
    toon2Id,
    toon3Id,
    toon4Id,
    toon5Id,
    new Date().toISOString(),
    'user1',
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

            // updates squad version if there's a name change
            if (isNameChange) {
              connection.query(
                nameChangeSql,
                nameChangeVariables,
                (nameChangeError, nameChangeResults) => {
                  if (nameChangeError) {
                    return connection.rollback(() => {
                      connection.release();
                      rej(nameChangeError);
                    });
                  }

                  connection.commit((commitError) => {
                    if (commitError) {
                      return connection.rollback(() => {
                        connection.release();
                        rej(commitError);
                      });
                    }

                    return console.info(`Squad Versions for ${oldSquadId} successfully updated to ${id}, and Squad for ${id} successfully updated.`);
                  });

                  return '';
                },
              );
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
