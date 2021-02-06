const config = require('./.config.json');

const logFactory = require('./setup/log')(config.logging[process.env.NODE_ENV]);
const patreonFactory = require('./setup/patreon');
const firebaseFactory = require('./setup/firebaseAdmin');
const serverFactory = require('./server');
const databaseFactory = require('./setup/db');

const app = { log: logFactory };

app.patreon = patreonFactory(app);
app.firebaseDb = firebaseFactory(app);
app.server = serverFactory(app);
app.database = databaseFactory(app);

module.exports = app;
