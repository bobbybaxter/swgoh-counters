const fs = require( 'fs' );
const path = require( 'path' );

module.exports = ( { database, log } ) => squads => {
  const sql = fs.readFileSync( path.join( __dirname, './sql/getBySquads.sql' )).toString();

  return new Promise(( res, rej ) => {
    database.query( sql, squads, ( error, results ) => {
      if ( error ) { rej( error ); }

      if ( !results || ( results && !results.length )) {
        log.warn( `Counter doesn't exist for squadIds (counter, opponent): ${ squads }` );
        return res( {} );
      }

      return res( JSON.parse( JSON.stringify( results[ 0 ] )));
    } );
  } ).catch( e => {
    throw e;
  } );
};
