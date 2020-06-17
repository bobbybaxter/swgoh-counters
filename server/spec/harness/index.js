let server;

const serverFactory = require('../../server');

beforeAll(async () => {
  const app = require('../../index');
  const srv = await serverFactory(app);
  await srv.initialize();
  server = srv;
});

afterAll(async () => {
  await server.stop();
});

module.exports = {
  server: new Proxy({}, {
    get(target, name) {
      return server[name];
    },
    set(target, name, value) {
      server[name] = value;
    },
  }),
};
