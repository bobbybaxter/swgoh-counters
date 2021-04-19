/* eslint-disable no-return-await */
module.exports = ({ data, patreon }) => ({
  method: 'GET',
  path: '/patreon/:accessToken',
  handler: async (request, reply) => {
    const { accessToken } = request.params;
    return await data.getStatus(accessToken);
  },
  schema: {
    response: {
      '2xx': {
        type: 'object',
        properties: {
          patronStatus: { type: 'string' },
          tier: { type: 'string' },
        },
      },
    },
  },
});
