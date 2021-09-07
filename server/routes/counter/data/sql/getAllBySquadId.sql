SELECT
	c.id,
	c.opponentSquadId,
	c.counterSquadId,
	cv.battleType
FROM counter c
JOIN counterVersion cv
  ON cv.id = c.latestVersionId 
WHERE c.counterSquadId = ?
OR c.opponentSquadId = ?;