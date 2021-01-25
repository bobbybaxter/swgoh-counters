module.exports = app => async (req, res) => {
  try {
    const squads = await app.data.squad.get(app);
    squads.sort((a, b) => ((a.name > b.name) ? 1 : -1));
    res.send(squads);
  } catch (err) {
    res.status(404).send([err.message]);
  }
};
