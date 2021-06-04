SELECT
	s.id,
	sv.name,
  sv.toon1Id,
  sv.toon2Id,
  sv.toon3Id,
  sv.toon4Id,
  sv.toon5Id,
  GREATEST(MAX(sv.createdOn), MAX(cv.createdOn), MAX(sv2.createdOn)) AS latestCounterVersion
FROM squad s
JOIN squadVersion sv ON s.latestVersionId = sv.id
JOIN counter c ON ?? = s.id
JOIN counterVersion cv ON c.latestVersionId = cv.id 
JOIN squad s2 ON ?? = s2.id
JOIN squadVersion sv2 ON s2.latestVersionId = sv2.id
JOIN `character` ch ON sv.toon1Id = ch.id
WHERE battleType = ?
-- AND ?
GROUP BY sv.toon1Id
ORDER BY ch.name, sv.name
LIMIT 2


-- TODO: make the following code dynamic
-- SELECT * FROM 
-- (
-- 	(SELECT 
-- 		s.*,
-- 		SUM(cs.seen) as totalSeen
-- 	FROM counter c
-- 	JOIN squad s ON s.id = c.opponentSquadId
-- 	JOIN counterStats cs ON cs.counterId = c.id
-- 	WHERE battleType = '5v5'
-- 	AND s.toon1Id = 'ASAJVENTRESS'
-- 	GROUP BY s.id
-- 	ORDER BY totalSeen DESC
-- 	LIMIT 1)

		
-- 	UNION ALL
	
-- 	(SELECT 
-- 		s.*,
-- 		SUM(cs.seen) as totalSeen
-- 	FROM counter c
-- 	JOIN squad s ON s.id = c.opponentSquadId
-- 	JOIN counterStats cs ON cs.counterId = c.id
-- 	WHERE battleType = '5v5'
-- 	AND s.toon1Id = 'BASTILASHAN'
-- 	GROUP BY s.id
-- 	ORDER BY totalSeen DESC
-- 	LIMIT 1)
	
-- 	UNION ALL
	
-- 	(SELECT 
-- 		s.*,
-- 		SUM(cs.seen) as totalSeen
-- 	FROM counter c
-- 	JOIN squad s ON s.id = c.opponentSquadId
-- 	JOIN counterStats cs ON cs.counterId = c.id
-- 	WHERE battleType = '5v5'
-- 	AND s.toon1Id = 'BOSSK'
-- 	GROUP BY s.id
-- 	ORDER BY totalSeen DESC
-- 	LIMIT 1)
-- ) as results