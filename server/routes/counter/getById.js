module.exports = app => async function getById({ params }, res) {
  const counter = await app.data.card.getById(params.counterId);
  res.send(counter);
};
