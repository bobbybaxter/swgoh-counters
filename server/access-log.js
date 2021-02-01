const fp = require('fastify-plugin');

module.exports = fp(async (server) => {
  server.addHook('onResponse', async (req, reply) => {
    const responseTime = reply.getResponseTime();

    reply.log.info({
      req,
      res: reply,
      responseTime,
    }, 'Access Log');
  });
});
