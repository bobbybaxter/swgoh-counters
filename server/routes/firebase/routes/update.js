module.exports = ({ data, server }) => ({
  method: 'PATCH',
  path: '/firebase/:id',
  preValidation: server.auth([server.firebaseAuth]),
  handler: async (request, reply) => {
    const { id } = request.params;
    const {
      allyCode, email, patreonId, patronStatus, username,
    } = request.body;

    const payload = {
      id,
      allyCode,
      email,
      patreonId,
      patronStatus,
      username,
    };

    const user = await data.update(payload);
    reply.send(user);
  },
});
