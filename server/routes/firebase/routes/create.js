module.exports = ({ data, log, server }) => ({
  method: 'POST',
  path: '/firebase',
  preValidation: server.auth([server.test]),
  handler: async (request, reply) => {
    const user = await data.create(request.body);
    reply.send(user);
  },
});
