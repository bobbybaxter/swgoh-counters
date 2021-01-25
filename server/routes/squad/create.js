module.exports = app => async (req, res) => {
  try {
    const createdSquadId = await app.data.squad.create(app, req.body);
    res.send([createdSquadId]);
  } catch (err) {
    res.status(404).send([err.message]);
  }
};
