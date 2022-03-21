function verifyDiscordToken( token ) {
  if ( token === process.env.DISCORD_TOKEN ) {
    return token;
  }
  throw new Error( 'Authorization Error' );
}

module.exports = async ( request, reply ) => {
  const { authorization } = request.headers;
  const authScheme = authorization && authorization.split( ' ' )[ 0 ];

  if ( authorization && authScheme === 'DiscordToken' ) {
    const token = authorization.split( ' ' )[ 1 ];
    request.authToken = token;
  } else {
    request.authToken = null;
  }

  const { authToken } = request;

  try {
    verifyDiscordToken( authToken );
  } catch ( err ) {
    console.error( 'Discord Auth Error', err );
    throw err;
  }
};
