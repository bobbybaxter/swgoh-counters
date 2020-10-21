module.exports = app => async (req, res) => {
  const deletedSquad = await app.data.squad.delete(app, req.params.id);

  if (deletedSquad !== 'ok') {
    res.status('400').send(deletedSquad.toString());
  }

  res.send(deletedSquad);
};
