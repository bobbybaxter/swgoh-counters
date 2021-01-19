module.exports = app => async (req, res) => {
  const videoLinks = await app.data.videoLink.get(app);
  videoLinks.sort((a, b) => ((a.createdOn > b.createdOn) ? 1 : -1));
  res.send(videoLinks);
};
