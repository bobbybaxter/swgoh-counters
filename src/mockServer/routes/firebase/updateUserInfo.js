import update from './data/update';

export default function updateUserInfo( db ) {
  this.patch( '/firebase', async ( schema, request ) => {
    await update( db, JSON.parse( request.requestBody ));
    return 'ok';
  } );
}
