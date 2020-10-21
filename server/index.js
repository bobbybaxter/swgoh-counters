const pino = require('pino');
const patreonFactory = require('./setup/patreon');
const middlewareFactory = require('./middleware');
const serverFactory = require('./server');
const dataFactory = require('./data');
const firebaseFactory = require('./setup/firebaseAdmin');
const databaseFactory = require('./setup/db');

const log = pino({
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: true,
});

const app = { log };

app.patreon = patreonFactory(app);
app.firebaseDb = firebaseFactory(app);
app.middleware = middlewareFactory(app);
app.data = dataFactory(app);
app.server = serverFactory(app);
app.database = databaseFactory(app);

module.exports = app;
