module.exports = app => async function get(res) {
  const squads = await app.data.squad.get();
  res.send(squads);
};
