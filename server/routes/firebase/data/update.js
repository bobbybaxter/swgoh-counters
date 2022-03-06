module.exports = ( { firebaseDb } ) => async ( {
  id,
  accessToken,
  allyCode,
  discordId,
  email,
  expiresIn,
  guildId,
  guildName,
  patreonId,
  patronStatus,
  refreshToken,
  tier,
  username,
} ) => {
  if ( id ) {
    firebaseDb.ref( `users/${ id }` ).update( {
      accessToken,
      allyCode,
      discordId,
      email,
      expiresIn,
      guildId,
      guildName,
      patreonId,
      patronStatus,
      refreshToken,
      tier,
      username,
    } );
  }

  return 'ok';
};
