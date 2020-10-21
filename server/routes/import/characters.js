module.exports = app => async (req, res) => {
  const characters = req.body;
  characters.forEach(character => app.data.character.create(app, character));

  res.send('ok');
};
