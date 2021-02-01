module.exports = app => async (req, res) => {
  try {
    const character = await app.data.character.getById(app, req.params.id);
    res.send(character);
  } catch (err) {
    res.status(404).send([err.message]);
  }
};
