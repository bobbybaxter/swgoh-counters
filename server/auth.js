const admin = require('firebase-admin');

module.exports = async (request, reply) => {
  if (
    request.headers.authorization && request.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    const newAuthToken = request.headers.authorization.split(' ')[1];
    request.authToken = newAuthToken;
  } else {
    request.authToken = null;
  }
  const { authToken } = request;

  try {
    const userInfo = await admin.auth().verifyIdToken(authToken);
    request.authId = userInfo.uid;
  } catch (err) {
    throw err;
  }
};
