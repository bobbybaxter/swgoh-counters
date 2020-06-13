const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');
const config = require('./.config');

module.exports = (app) => {
  const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.firebaseDbURL,
  });

  const firebaseDb = firebaseAdmin.database();

  return firebaseDb;
};
