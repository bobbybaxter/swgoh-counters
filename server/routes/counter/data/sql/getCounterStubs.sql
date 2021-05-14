SELECT 
	c.id,
	c.opponentSquadId,
	c.counterSquadId,
	c.latestVersionId,
	cv.isHardCounter,
	cv.battleType,
	cv.counterStrategy,
  cv.isToon2Req,
  cv.isToon3Req,
  cv.isToon4Req,
  cv.isToon5Req,
  cv.toon1Zetas,
  cv.toon2Zetas,
  cv.toon3Zetas,
  cv.toon4Zetas,
  cv.toon5Zetas,
	cv.createdOn AS 'counterCreatedOn',
	cv.createdById AS 'counterCreatedById',
	cv.createdByName AS 'counterCreatedByName',
	sv.name,
	sv.toon1Id,
	sv.createdOn AS 'squadCreatedOn',
	sv.createdById AS 'squadCreatedById',
	sv.createdByName AS 'squadCreatedByName'
FROM counter c
JOIN counterVersion cv ON c.latestVersionId = cv.id
JOIN squad s ON ?? = s.id
JOIN squadVersion sv ON s.latestVersionId  = sv.id
JOIN squad s2 ON ?? = s2.id
JOIN squadVersion sv2 ON s2.latestVersionId  = sv2.id
JOIN `character` ch on sv.toon1Id = ch.id
WHERE sv2.toon1Id = ?
AND cv.battleType = ?
ORDER BY ch.name, sv.name;