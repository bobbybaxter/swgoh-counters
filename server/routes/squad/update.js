module.exports = app => async (req, res) => {
  const squadToUpdate = await app.data.squad.getById(app, req.params.id);

  if (!squadToUpdate.length) {
    res.status('400').send('Squad does not exist.');
  }

  const updatedSquad = await app.data.squad.update(app, squadToUpdate, req.body);

  if (updatedSquad !== 'ok') {
    res.status('400').send('Squad was not updated.');
  }

  res.send(updatedSquad);
};
