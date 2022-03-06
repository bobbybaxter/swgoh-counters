module.exports = ( { firebaseDb } ) => async user => {
  if ( user.id ) {
    firebaseDb.ref( `users/${ user.id }` ).set( {
      accessToken: '',
      allyCode: '',
      discordId: '',
      email: user.email,
      expiresIn: '',
      guildId: '',
      guildName: '',
      patreonId: '',
      patronStatus: '',
      refreshToken: '',
      tier: '',
      username: '',
    } );
  }
  return user;
};
