module.exports = ({ data, log, server }) => ({
  method: 'GET',
  path: '/firebase/:id',
  handler: async (request, reply) => {
    try {
      const user = await data.getByFirebaseUid(request.params.id);
      reply.send(user);
    } catch (err) {
      log.error(err);
    }
  },
});
