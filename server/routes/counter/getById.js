module.exports = app => async (req, res) => {
  const counter = await app.data.counter.getById(app, req.params.id);

  if (counter instanceof Error) {
    res.status('400').send("Counter doesn't exist.");
  }

  const formattedCounter = {
    ...counter,
    toon1Zetas: counter.toon1Zetas ? counter.toon1Zetas.split(',') : [],
    toon2Zetas: counter.toon2Zetas ? counter.toon2Zetas.split(',') : [],
    toon3Zetas: counter.toon3Zetas ? counter.toon3Zetas.split(',') : [],
    toon4Zetas: counter.toon4Zetas ? counter.toon4Zetas.split(',') : [],
    toon5Zetas: counter.toon5Zetas ? counter.toon5Zetas.split(',') : [],
  };

  res.send(formattedCounter);
};
