const pino = require('pino');
// const expressPino = require('express-pino-logger');
const patreonFactory = require('./patreon');
const middlewareFactory = require('./middleware');
const serverFactory = require('./server');
const dataFactory = require('./data');
const firebaseFactory = require('./firebaseAdmin');

const log = pino({
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: true,
});
// const logger = expressPino({ log });

const app = { log };

app.patreon = patreonFactory(app);
app.firebaseDb = firebaseFactory(app);
app.middleware = middlewareFactory(app);
app.data = dataFactory(app);
app.server = serverFactory(app);

module.exports = app;
