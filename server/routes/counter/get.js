module.exports = app => async function get(res, req) {
  res.send(await app.data.counter.get());
};
