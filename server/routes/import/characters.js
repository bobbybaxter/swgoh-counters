module.exports = app => async (req, res) => {
  // requests characters and zetas from swgoh.gg
  const characters = await app.data.character.getOld(app);

  // adds Blank character for empty squad slots
  characters.push({
    id: 'BLANK',
    name: 'Blank',
    zetas: [],
  });

  // drops zeta tables, so zetas aren't duplicated
  await app.data.zeta.deleteAll(app);

  // imports all zetas
  characters.forEach(character => character.zetas.forEach(
    zeta => app.data.import.zetas(app, character.id, zeta),
  ));

  // imports all characters - no need to drop tables as characters have fixed ids
  characters.forEach(character => app.data.character.create(app, character));

  console.log('character import complete');
  res.send('ok');
};
