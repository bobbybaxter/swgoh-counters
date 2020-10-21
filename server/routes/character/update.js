module.exports = app => async (req, res) => {
  const characterToUpdate = await app.data.character.getById(app, req.params.id);

  const updatedCharacter = await app.data.character.update(
    app,
    characterToUpdate,
    req.body,
  );

  if (updatedCharacter !== 'ok') {
    res.status('400').send('Character was not updated.');
  }

  res.send(updatedCharacter);
};
