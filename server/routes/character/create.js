module.exports = app => async (req, res) => {
  const createdCharacter = await app.data.character.create(app, req.body);

  if (createdCharacter !== 'ok') {
    res.status('400').send('Character was not created.');
  }

  res.send(createdCharacter);
};
