const admin = require( 'firebase-admin' );

function verifyDiscordToken( token ) {
  if ( token === process.env.DISCORD_TOKEN ) {
    return token;
  }
  throw new Error( 'Authorization Error' );
}

module.exports = async ( request, reply ) => {
  const { authorization } = request.headers;
  const authScheme = authorization && authorization.split( ' ' )[ 0 ];
  const token = authorization.split( ' ' )[ 1 ];

  if ( authorization && ( authScheme === 'Bearer' || 'DiscordToken' )) {
    request.authToken = token;
  } else {
    request.authToken = null;
  }

  const { authToken } = request;

  // TODO: make sure DiscordToken auths can't access Firebase areas
  try { // eslint-disable-line no-useless-catch
    if ( authScheme === 'DiscordToken' ) {
      const discordToken = verifyDiscordToken( authToken );
      request.authId = discordToken;
    } else {
      const userInfo = await admin.auth().verifyIdToken( authToken );
      request.authId = userInfo.uid;
    }
  } catch ( err ) {
    throw err;
  }
};
