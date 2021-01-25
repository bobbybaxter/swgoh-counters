module.exports = app => async (req, res) => {
  try {
    const createdCharacter = await app.data.character.create(app, req.body);
    res.send(createdCharacter);
  } catch (err) {
    res.status(400).send('Character was not created.');
  }
};
