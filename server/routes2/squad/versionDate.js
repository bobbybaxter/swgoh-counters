module.exports = app => async (req, res) => {
  try {
    const versionDate = await app.data.squad.getVersionDate(app);
    res.send(versionDate);
  } catch (err) {
    res.status(404).send([err.message]);
  }
};
