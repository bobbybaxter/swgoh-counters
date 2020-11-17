module.exports = app => async (req, res) => {
  const normal = await app.data.squad.getStubs(app, 'normal', req.params.size);
  const reverse = await app.data.squad.getStubs(app, 'reverse', req.params.size);

  const squadStubs = {
    normal,
    reverse,
  };

  res.send(squadStubs);
};
