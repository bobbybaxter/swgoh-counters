module.exports = app => async (req, res) => {
  const squads = await app.data.squad.getOld(app);
  squads.forEach(async (squad) => {
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

    const toon1 = await app.data.character.getByName(app, leaderName);
    const toon2 = await app.data.character.getByName(app, toon2Name);
    const toon3 = await app.data.character.getByName(app, toon3Name);
    const toon4 = await app.data.character.getByName(app, toon4Name);
    const toon5 = await app.data.character.getByName(app, toon5Name);

    const squadToCreate = {
      name,
      description,
      counterStrategy,
      toon1Id: toon1.id,
      toon2Id: toon2.id,
      toon3Id: toon3.id,
      toon4Id: toon4.id,
      toon5Id: toon5.id,
    };

    await app.data.squad.create(app, squadToCreate);
  });

  console.info('squad import complete');
  res.send('ok');
};
