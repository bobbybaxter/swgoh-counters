module.exports = ( { firebaseDb } ) => async guildId => {
  firebaseDb.ref( `guilds/${ guildId }` ).remove();
  return 'ok';
};
