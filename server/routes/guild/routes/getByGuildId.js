const _ = require('lodash');

module.exports = ({ data, log }) => ({
  method: 'GET',
  path: '/guild/:id',
  handler: async (request, reply) => {
    try {
      const guild = await data.getByGuildId(request.params.id);

      if (_.isEmpty(guild)) {
        return reply
          .type('application/json')
          .send(guild);
      }

      const guildTierUsers = guild.guildTierUsers.split(',');

      const formattedGuild = {
        ...guild,
        guildTierUsers,
      };

      return reply
        .type('application/json')
        .send(formattedGuild);
    } catch (err) {
      log.error(err);
    }
  },
  schema: {
    response: {
      '2xx': {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          guildTierUsers: { type: 'array' },
        },
      },
    },
  },
});
