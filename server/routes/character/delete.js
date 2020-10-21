module.exports = app => async (req, res) => {
  const deletedCharacter = await app.data.character.delete(app, req.params.id);

  if (deletedCharacter !== 'ok') {
    res.status('400').send(deletedCharacter.toString());
  }

  res.send(deletedCharacter);
};
