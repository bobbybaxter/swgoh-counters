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
      leaderReq,
      toon2Req,
      toon3Req,
      toon4Req,
      toon5Req,
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
      isToon1Req: leaderReq === true ? 1 : 0,
      isToon2Req: toon2Req === true ? 1 : 0,
      isToon3Req: toon3Req === true ? 1 : 0,
      isToon4Req: toon4Req === true ? 1 : 0,
      isToon5Req: toon5Req === true ? 1 : 0,
    };

    await app.data.squad.create(app, squadToCreate);
  });

  res.send('ok');
};
