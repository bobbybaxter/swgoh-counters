SELECT
	id,
  counterId,
  season,
  seen,
  winPerc,
  avgBanners
FROM counterStats
WHERE counterId = ?
AND season = ?;
