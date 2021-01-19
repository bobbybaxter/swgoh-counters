SELECT 
	c.counterSquadId AS 'id',
	sv.name,
	c.id AS 'counterId',
	cv.isHardCounter,
	sv.toon1Id,
	cv.createdOn AS 'counterCreatedOn',
	cv.createdById AS 'counterCreatedById',
	cv.createdByName AS 'counterCreatedByName',
	sv.createdOn AS 'squadCreatedOn',
	sv.createdById AS 'squadCreatedById',
	sv.createdByName AS 'squadCreatedByName'
FROM counter c
JOIN counterVersion cv ON c.latestVersionId = cv.id
JOIN squad s ON ?? = s.id
JOIN squadVersion sv ON s.latestVersionId  = sv.id
WHERE ?? = ?
AND cv.battleType = ?
ORDER BY cv.createdOn DESC;