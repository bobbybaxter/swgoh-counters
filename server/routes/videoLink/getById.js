module.exports = app => async (req, res) => {
  const videoLink = await app.data.videoLink.getById(app, req.params.id);

  if (videoLink instanceof Error) {
    res.status('400').send("Video link doesn't exist.");
  }

  res.send(videoLink);
};
