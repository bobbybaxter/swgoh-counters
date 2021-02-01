module.exports = app => async (req, res) => {
  try {
    const deletedSquad = await app.data.squad.delete(app, req.params.id);
    res.send(deletedSquad);
  } catch (err) {
    res.status(404).send([err.message]);
  }
};
