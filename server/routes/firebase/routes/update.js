// TODO: remove id from path, it can come in the payload
module.exports = ({ data, server }) => ({
  method: 'PATCH',
  path: '/firebase/:id',
  preValidation: server.auth([server.firebaseAuth]),
  handler: async (request, reply) => {
    const { id } = request.params;
    const {
      accessToken,
      allyCode,
      email,
      expiresIn,
      guildId,
      guildName,
      patreonId,
      patronStatus,
      refreshToken,
      tier,
      username,
    } = request.body;

    const payload = {
      id,
      accessToken,
      allyCode,
      email,
      expiresIn,
      guildId,
      guildName,
      patreonId,
      patronStatus,
      refreshToken,
      tier,
      username,
    };

    const user = await data.update(payload);
    reply.send(user);
  },
  schema: {
    params: {
      id: { type: 'string' },
    },
    body: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        allyCode: { type: 'string' },
        email: { type: 'string' },
        expiresIn: { type: 'string' },
        guildId: { type: 'string' },
        guildName: { type: 'string' },
        patreonId: { type: 'string' },
        patronStatus: { type: 'string' },
        refreshToken: { type: 'string' },
        tier: { type: 'string' },
        username: { type: 'string' },
      },
    },
    response: {
      '2xx': {
        type: 'string',
      },
    },
  },
});
