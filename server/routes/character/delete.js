module.exports = app => async (req, res) => {
  try {
    const deletedCharacter = await app.data.character.delete(app, req.params.id);
    res.send(deletedCharacter);
  } catch (err) {
    res.status(400).send('Character was not deleted.');
  }
};
