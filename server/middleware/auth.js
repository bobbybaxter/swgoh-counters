const admin = require('firebase-admin');

const getAuthToken = (req, res, next) => {
  if (
    req.headers.authorization
    && req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    const newAuthToken = req.headers.authorization.split(' ')[1];
    req.authToken = newAuthToken;
  } else {
    req.authToken = null;
  }
  next();
};

module.exports = async function checkIfAuthenticated(req, res, next) {
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req;
      const userInfo = await admin.auth().verifyIdToken(authToken);
      req.authId = userInfo.uid;
      return next();
    } catch (e) {
      console.log('error :>> ', e);
      return res
        .status(401)
        .send({ Error: 'You are not authorized to make this request' });
    }
  });
};
