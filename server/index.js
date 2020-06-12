const pino = require('pino');
// const expressPino = require('express-pino-logger');
const admin = require('firebase-admin');
const middlewareFactory = require('./middleware');
const serverFactory = require('./server');
const dataFactory = require('./data');
const serviceAccount = require('./firebase-service-account.json');
const config = require('./.config');

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.firebaseDbURL,
});

const database = firebaseAdmin.database();

const log = pino({
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: true,
});
// const logger = expressPino({ log });

const app = { log };

app.firebaseDb = database;
app.middleware = middlewareFactory(app);
app.data = dataFactory(app);
app.server = serverFactory(app);

module.exports = app;
