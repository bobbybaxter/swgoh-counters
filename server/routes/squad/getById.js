module.exports = app => async function getById({ params }, res) {
  const squad = await app.data.card.getById(params.squadId);
  res.send(squad);
};
