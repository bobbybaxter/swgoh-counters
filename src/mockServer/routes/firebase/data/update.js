export default async function update( db, updatedUser ) {
  const {
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
  } = updatedUser;

  if ( id ) {
    await db.ref( `users/${ id }` ).update( {
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
}
