SELECT 
	c.counterSquadId AS 'id',
	s.name,
	c.id AS 'counterId',
	cv.isHardCounter,
	sv.toon1Id,
	cv.createdOn AS 'counterCreatedOn',
	cv.createdBy AS 'counterCreatedBy',
	sv.createdOn AS 'squadCreatedOn',
	sv.createdBy AS 'squadCreatedBy'
FROM counter c
JOIN counterVersion cv ON c.latestVersionId = cv.id
JOIN squad s ON ?? = s.id
JOIN squadVersion sv ON s.latestVersionId  = sv.id
WHERE ?? = ?
AND cv.battleType = ?