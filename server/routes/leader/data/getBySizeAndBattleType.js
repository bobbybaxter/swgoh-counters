const fs = require( 'fs' );
const path = require( 'path' );

module.exports = ( { database, log } ) => ( size, view ) => {
  const sql = fs.readFileSync( path.join( __dirname, './sql/getBySizeAndBattleType.sql' )).toString();

  return new Promise(( res, rej ) => {
    database.query( sql, [ size, view ], ( error, results ) => {
      if ( error ) { rej( error ); }

      if ( !results || ( results && !results.length )) {
        log.warn( 'No leader squads to show' );
        return res( {} );
      }

      return res( JSON.parse( JSON.stringify( results )));
    } );
  } ).catch( e => {
    throw e;
  } );
};
