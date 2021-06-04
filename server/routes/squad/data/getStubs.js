const fs = require('fs');
const path = require('path');
// const mysql = require('mysql');

// module.exports = ({ log }) => (type, leaders, size) => {
module.exports = ({ database, log }) => (type, size) => {
  // const host = process.env.DB_HOST || 'localhost';
  // const user = process.env.DB_USER || 'root';
  // const password = process.env.DB_PASS || '';
  // const database = process.env.SWGOH_DB_DATABASE;

  // const connection = mysql.createConnection({
  //   host,
  //   user,
  //   password,
  //   database,
  // });

  // const leaderArray = [];
  // leaders.forEach((leader) => {
  //   leaderArray.push(`sv.toon1Id = ${leader.id}`);
  // });

  // const leaderWhereStatement = leaderArray.join(' OR ');
  // console.log('leaderWhereStatement :>> ', leaderWhereStatement);

  const sql = fs.readFileSync(path.join(__dirname, './sql/getStubs.sql')).toString();
  const leftSideSquad = type === 'normal' ? 'opponentSquadId' : 'counterSquadId';
  const rightSideSquad = type === 'normal' ? 'counterSquadId' : 'opponentSquadId';
  const variables = [
    leftSideSquad,
    rightSideSquad,
    size,
    // leaderWhereStatement,
  ];

  return new Promise((res, rej) => {
    database.query(sql, variables, (error, results) => {
      if (error) { rej(error); }

      if (!results || (results && !results.length)) {
        log.warn('Squad database is empty');
        return res({});
      }

      return res(JSON.parse(JSON.stringify(results)));
    });
  }).catch((err) => {
    throw err;
  });

  // connection.connect();

  // const query = new Promise((res, rej) => {
  //   connection.query(sql, variables, (error, results) => {
  //     if (error) { rej(error); }

  //     if (!results || (results && !results.length)) {
  //       log.warn('Squad database is empty');
  //       return res({});
  //     }

  //     return res(JSON.parse(JSON.stringify(results)));
  //   });
  // }).catch((err) => {
  //   throw err;
  // });

  // connection.end();

  // return query;
};
