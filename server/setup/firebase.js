const admin = require('firebase-admin');

module.exports = () => {
  admin.initializeApp(
    { credential: admin.credential.applicationDefault() },
    { databaseURL: process.env.FIREBASE_DATABASE.URL },
  );
};
