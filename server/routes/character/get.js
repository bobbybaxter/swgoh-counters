module.exports = app => async (req, res) => {
  const characters = await app.data.character.get(app);
  res.send(characters);
};
