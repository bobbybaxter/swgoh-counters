module.exports = app => async (req, res) => {
  const createdSquad = await app.data.squad.create(app, req.body);

  if (createdSquad.res !== 'ok') {
    return res.status('400').send('Squad was not created.');
  }

  return res.send(createdSquad.squadId);
};
