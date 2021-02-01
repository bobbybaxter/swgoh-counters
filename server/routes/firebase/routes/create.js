module.exports = ({ data, server }) => ({
  method: 'POST',
  path: '/firebase',
  preValidation: server.auth([server.firebaseAuth]),
  handler: async (request, reply) => {
    const user = await data.create(request.body);
    reply.send(user);
  },
});
