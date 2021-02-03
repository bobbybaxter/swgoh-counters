const { userId, username } = require('../../../.config.json');

module.exports = ({ data, log }) => ({
  method: 'GET',
  path: '/import/squads',
  handler: async (request, reply) => {
    const squads = await data.squad.getOld();
    await Promise.all(squads.map(async (squad, i) => {
      const {
        name,
        description,
        counterStrategy,
        leaderName,
        toon2Name,
        toon3Name,
        toon4Name,
        toon5Name,
      } = squad;

      const toon1 = await data.character.getByName(leaderName);
      const toon2 = await data.character.getByName(toon2Name);
      const toon3 = await data.character.getByName(toon3Name);
      const toon4 = await data.character.getByName(toon4Name);
      const toon5 = await data.character.getByName(toon5Name);

      const squadToCreate = {
        name,
        description,
        generalStrategy: counterStrategy,
        toon1Id: toon1.id,
        toon2Id: toon2.id,
        toon3Id: toon3.id,
        toon4Id: toon4.id,
        toon5Id: toon5.id,
        userId,
        username,
      };

      try {
        await data.squad.create(squadToCreate);
      } catch (err) {
        throw new Error(err);
      }
    }));

    log.info('squad import complete');
    reply.send('ok');
  },
});
