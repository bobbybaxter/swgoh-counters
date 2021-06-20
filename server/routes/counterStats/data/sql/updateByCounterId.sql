UPDATE counterStats
SET season = ?,
  seen = ?,
  winPerc = ?,
  avgBanners = ?
WHERE counterId = ?;