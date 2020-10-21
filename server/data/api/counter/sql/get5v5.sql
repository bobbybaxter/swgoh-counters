SELECT
	c.id,
	c.opponentSquadId,
	c.counterSquadId,
	c.latestVersionId,
	cv.isHardCounter,
	cv.battleType,
	cv.description,
	cv.createdOn,
	cv.createdBy
FROM counter c
JOIN counterVersion cv
  ON cv.id = c.latestVersionId 
WHERE battleType = "5v5"