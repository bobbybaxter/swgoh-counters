const _ = require( 'lodash' );

export default async function get( db, id ) {
  const user = await db
    .ref( `users/${ id }` )
    .once( 'value' )
    .then( snapshot => ( snapshot.val()) || {} );
  if ( !_.isEmpty( user )) {
    user.id = id;
  }
  return user;
}
