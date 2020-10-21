module.exports = app => async (req, res) => {
  const character = await app.data.character.getById(app, req.params.id);

  if (character instanceof Error) {
    res.status('400').send("Character doesn't exist.");
  }

  res.send(character);
};
