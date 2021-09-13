const fs = require( 'fs' );
const path = require( 'path' );

module.exports = ( { database, log } ) => variables => {
  const sql = fs.readFileSync( path.join( __dirname, './sql/getSingleLeader.sql' )).toString();

  return new Promise(( res, rej ) => {
    database.query( sql, variables, ( error, results ) => {
      if ( error ) { rej( error ); }

      if ( !results || ( results && !results.length )) {
        log.warn( 'No leader squad' );
        return res( {} );
      }

      return res( JSON.parse( JSON.stringify( results[ 0 ] )));
    } );
  } ).catch( e => {
    throw e;
  } );
};
