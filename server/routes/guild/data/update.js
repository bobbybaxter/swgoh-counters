module.exports = ( { firebaseDb } ) => async ( { id, name, guildTierUsers } ) => {
  firebaseDb.ref( `guilds/${ id }` ).update( {
    name,
    guildTierUsers,
  } );
  return 'ok';
};
