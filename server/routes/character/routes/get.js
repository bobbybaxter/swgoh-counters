module.exports = ({ data }) => ({
  method: 'GET',
  path: '/character',
  handler: async (request, reply) => {
    const allCharacters = await data.get();
    const allZetas = await data.zeta.get();

    const characters = allCharacters && allZetas && allCharacters.map((char) => {
      const zetas = allZetas
        .filter(zeta => zeta.characterId === char.id)
        .map(zeta => zeta.name);

      return ({
        ...char,
        zetas,
      });
    });

    reply.send(characters);
  },
  schema: {
    response: {
      '2xx': {
        type: 'array',
        items: {
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            zetas: { type: 'array' },
          },
        },
      },
    },
  },
});
