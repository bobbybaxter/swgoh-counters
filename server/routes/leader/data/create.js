const fs = require( 'fs' );
const path = require( 'path' );
const { nanoid } = require( 'nanoid' );

module.exports = ( { database, log } ) => ( {
  squadId,
  battleType,
  view,
} ) => {
  const sql = fs.readFileSync( path.join( __dirname, './sql/create.sql' )).toString();
  const leaderId = nanoid();

  const variables = [
    leaderId,
    squadId,
    battleType,
    view,
  ];

  return new Promise(( res, rej ) => {
    database.query( sql, variables, ( error, results ) => {
      if ( error ) { rej( error ); }

      if ( results && results.affectedRows === 1 ) {
        log.info( `Leader squad for ${ squadId } successfully created with id: ${ leaderId }` );
      }

      res( 'ok' );
    } );
  } ).catch( err => {
    if ( err.code === 'ER_DUP_ENTRY' ) {
      return ( 'ok' );
    }
    throw err;
  } );
};
