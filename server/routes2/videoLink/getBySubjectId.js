module.exports = app => async (req, res) => {
  const videoLinks = await app.data.videoLink.getBySubjectId(app, req.params.subjectId);

  if (videoLinks instanceof Error) {
    res.status('400').send("Video link doesn't exist.");
  }

  res.send(videoLinks);
};
