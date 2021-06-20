const mysql = require( 'mysql' );

module.exports = app => {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASS || '';
  const port = process.env.DB_PORT || '';
  const database = process.env.NODE_ENV === 'production' ? process.env.DB_DATABASE : process.env.DB_DATABASE_TEST;

  const pool = mysql.createPool( {
    connectionLimit: 40,
    waitForConnections: true,
    host,
    user,
    port,
    password,
    database,
  } );

  return pool;
};
