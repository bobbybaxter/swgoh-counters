const _ = require('lodash');
require('dotenv-flow').config({
  node_env: process.env.NODE_ENV || 'development',
  path: 'server/',
});
require('dotenv').config({ path: 'server/.env' });
const config = require('./.config.json');

const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);

const logFactory = require('./setup/log')(finalConfig);
const patreonFactory = require('./setup/patreon');
const firebaseFactory = require('./setup/firebaseAdmin');
const serverFactory = require('./server');
const databaseFactory = require('./setup/db');

const app = {
  log: logFactory,
  config: finalConfig,
};

app.patreon = patreonFactory(app);
app.firebaseDb = firebaseFactory(app);
app.server = serverFactory(app);
app.database = databaseFactory(app);

module.exports = app;
