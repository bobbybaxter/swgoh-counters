module.exports = app => async (req, res) => {
  try {
    const squad = await app.data.squad.getById(app, req.params.id);
    res.send(squad);
  } catch (err) {
    res.status(404).send([err.message]);
  }
};
