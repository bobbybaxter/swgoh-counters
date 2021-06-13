SELECT 
	ROUND( AVG(cs.winPerc), 2) AS avgWinPerc,
	SUM(cs.winPerc) AS sumWinPerc,
	COUNT(counterId) AS counterNum,
	season
FROM counterStats cs
WHERE counterId = ?
GROUP BY counterId
ORDER BY season DESC;