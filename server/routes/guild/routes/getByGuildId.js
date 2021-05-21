const _ = require('lodash');

module.exports = ({ data, log }) => ({
  method: 'GET',
  path: '/guild/:id',
  handler: async (request, reply) => {
    let formattedGuild = {};
    try {
      const guild = await data.getByGuildId(request.params.id);

      if (_.isEmpty(guild)) {
        return reply
          .type('application/json')
          .send(guild);
      }

      const guildTierUsers = guild.guildTierUsers.split(',');

      formattedGuild = {
        ...guild,
        guildTierUsers,
      };

      return reply
        .type('application/json')
        .send(formattedGuild);
    } catch (err) {
      log.error(err);
      return formattedGuild;
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
