const fs = require( 'fs' );
const path = require( 'path' );

module.exports = ( { database, log } ) => ( id, type, size ) => {
  const sql = fs.readFileSync( path.join( __dirname, './sql/getLatestCounterVersion.sql' )).toString();
  const leftSideSquad = type === 'normal' ? 'opponentSquadId' : 'counterSquadId';
  const rightSideSquad = type === 'normal' ? 'counterSquadId' : 'opponentSquadId';
  const variables = [
    leftSideSquad,
    rightSideSquad,
    size,
    id,
  ];

  return new Promise(( res, rej ) => {
    database.query( sql, variables, ( error, results ) => {
      if ( error ) { rej( error ); }

      if ( !results || ( results && !results.length )) {
        log.warn( `Counter doesn't exist for id: ${ id }` );
        return res( {} );
      }

      return res( JSON.parse( JSON.stringify( results[ 0 ] )));
    } );
  } ).catch( err => {
    throw err;
  } );
};
