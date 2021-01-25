const mysql = require('mysql');

module.exports = (app) => {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASS || '';
  const port = process.env.DB_PORT || '';
  const database = app.server.get('env') === 'production' ? process.env.DB_DATABASE : process.env.DB_DATABASE_TEST;

  app.log.info(`${host} using ${database} database`);

  const pool = mysql.createPool({
    connectionLimit: 10,
    host,
    user,
    port,
    password,
    database,
  });

  return pool;
};
