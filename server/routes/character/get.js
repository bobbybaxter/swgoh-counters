module.exports = app => async (req, res) => {
  try {
    const allCharacters = await app.data.character.get(app);
    const allZetas = await app.data.zeta.get(app);

    const characters = allCharacters && allZetas && allCharacters.map((char) => {
      const zetas = allZetas
        .filter(zeta => zeta.characterId === char.id)
        .map(zeta => zeta.name);

      return ({
        ...char,
        zetas,
      });
    });

    res.send(characters);
  } catch (err) {
    res.status(404).send([err.message]);
  }
};
