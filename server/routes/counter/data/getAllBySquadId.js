const fs = require( 'fs' );
const path = require( 'path' );

module.exports = ( { database, log } ) => squadId => {
  const sql = fs.readFileSync( path.join( __dirname, './sql/getAllBySquadId.sql' )).toString();

  return new Promise(( res, rej ) => {
    database.query( sql, [ squadId, squadId ], ( error, results ) => {
      if ( error ) { rej( error ); }

      if ( !results || ( results && !results.length )) {
        log.warn( `Counters don't exist for squadId: ${ squadId }` );
        return res( {} );
      }

      return res( JSON.parse( JSON.stringify( results )));
    } );
  } ).catch( err => {
    throw err;
  } );
};
