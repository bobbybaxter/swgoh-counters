const fp = require('fastify-plugin');

module.exports = fp(async (server) => {
  server.addHook('onResponse', async (req, reply) => {
    // const responseTime = reply.getResponseTime();
    const { method, url } = req;
    const { statusCode } = reply;

    reply.log.info(`Access Log - res: { statuscode: ${statusCode} } req: { method: ${method}, url: ${url} }`);

    // reply.log.info({
    //   req,
    //   res: reply,
    //   // responseTime,
    // }, 'Access Log');
  });
});
