const fs = require( 'fs' );
const path = require( 'path' );

module.exports = ( { database, log } ) => variables => {
  const sql = fs.readFileSync( path.join( __dirname, './sql/getMultipleLeaders.sql' )).toString();

  return new Promise(( res, rej ) => {
    database.query( sql, variables, ( error, results ) => {
      if ( error ) { rej( error ); }

      if ( !results || ( results && !results.length )) {
        log.warn( 'No leader squads' );
        return res( {} );
      }

      return res( JSON.parse( JSON.stringify( results )));
    } );
  } ).catch( e => {
    throw e;
  } );
};
