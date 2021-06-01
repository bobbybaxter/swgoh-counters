module.exports = ({ data, log }) => ({
  method: 'GET',
  path: '/import/characters',
  handler: async (request, reply) => {
    try {
      // requests characters and zetas from swgoh.gg
      const characters = await data.character.getOld();

      // adds Blank character for empty squad slots
      characters.push({
        id: 'BLANK',
        name: 'Blank',
        zetas: [],
      });

      // drops zeta tables, so zetas aren't duplicated
      await data.zeta.deleteAll();

      // imports all zetas
      characters.forEach(character => character.zetas.forEach(
        zeta => data.zetas(character.id, zeta),
      ));

      // imports all characters - no need to drop tables as characters have fixed ids
      await Promise.all(characters.map(character => data.character.create(character)));

      log.info('character import complete');
      reply.send('ok');
    } catch (err) {
      log.error(err);
    }
  },
});
