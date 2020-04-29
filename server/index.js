const middlewareFactory = require('./middleware');
const serverFactory = require('./server');
const dataFactory = require('./data');

const app = {};

app.middleware = middlewareFactory(app);
app.data = dataFactory(app);
app.server = serverFactory(app);

module.exports = app;
