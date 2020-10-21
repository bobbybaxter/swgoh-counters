module.exports = app => async (req, res) => {
  const createdSquad = await app.data.squad.create(app, req.body);

  if (createdSquad !== 'ok') {
    res.status('400').send('Squad was not created.');
  }

  res.send(createdSquad);
};
