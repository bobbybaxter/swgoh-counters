const firebase = require('firebase/app');
const pino = require('pino');
// const expressPino = require('express-pino-logger');
const middlewareFactory = require('./middleware');
const serverFactory = require('./server');
const dataFactory = require('./data');
const firebaseConfig = require('./firebase-config');

firebase.initializeApp(firebaseConfig);

const log = pino({
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: true,
});
// const logger = expressPino({ log });

const app = { log };

app.middleware = middlewareFactory(app);
app.data = dataFactory(app);
app.server = serverFactory(app);

module.exports = app;
