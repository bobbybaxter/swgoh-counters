SELECT 
	c.counterSquadId as 'id',
	s.name,
	c.id as 'counterId',
	cv.battleType,
	cv.isHardCounter,
	sv.counterStrategy,
	sv.description as 'squadDescription',
	sv.toon1Id,
	char1.name as 'toon1name',
	sv.isToon1Req,
	sv.toon2Id,
	char2.name as 'toon2name',
	sv.isToon2Req,
	sv.toon3Id,
	char3.name as 'toon3name',
	sv.isToon3Req,
	sv.toon4Id,
	char4.name as 'toon4name',
	sv.isToon4Req,
	sv.toon5Id,
	char5.name as 'toon5name',
	sv.isToon5Req,
	cv.createdOn as 'counterCreatedOn',
	cv.createdBy as 'counterCreatedBy',
	sv.createdOn as 'squadCreatedOn',
	sv.createdBy as 'squadCreatedBy'
FROM counter c
JOIN counterVersion cv on c.latestVersionId = cv.id
JOIN squad s ON ?? = s.id
JOIN squadVersion sv ON s.latestVersionId  = sv.id
JOIN `character` char1 ON char1.id = sv.toon1Id
JOIN `character` char2 ON char2.id = sv.toon2Id
JOIN `character` char3 ON char3.id = sv.toon3Id
JOIN `character` char4 ON char4.id = sv.toon4Id
JOIN `character` char5 ON char5.id = sv.toon5Id
WHERE ?? = ?
AND cv.battleType = ?