SELECT
	SUM(cs.seen) AS totalSeen,
	ROUND( AVG(cs.winPerc), 3) AS avgWin,
	CONCAT('[', 
		'{',
			'"id":', '"', osqv.toon1Id, '",', 
			'"name":', '"', char1.name, '"', 
		'},',
		'{',
			'"id":', '"', osqv.toon2Id, '",', 
			'"name":', '"', char2.name, '"', 
		'},',
		'{',
			'"id":', '"', osqv.toon3Id, '",', 
			'"name":', '"', char3.name, '"', 
		'},',
		'{',
			'"id":', '"', osqv.toon4Id, '",', 
			'"name":', '"', char4.name, '"', 
		'},',
		'{',
			'"id":', '"', osqv.toon5Id, '",', 
			'"name":', '"', char5.name, '"', 
		'}',
	']') AS 'opponentSquad',
	CONCAT('[', 
		'{',
			'"id":', '"', csqv.toon1Id, '",', 
			'"name":', '"', char6.name, '"', 
		'},',
		'{',
			'"id":', '"', csqv.toon2Id, '",', 
			'"name":', '"', char7.name, '"', 
		'},',
		'{',
			'"id":', '"', csqv.toon3Id, '",', 
			'"name":', '"', char8.name, '"', 
		'},',
		'{',
			'"id":', '"', csqv.toon4Id, '",', 
			'"name":', '"', char9.name, '"', 
		'},',
		'{',
			'"id":', '"', csqv.toon5Id, '",', 
			'"name":', '"', char10.name, '"', 
		'}',
	']') AS 'counterSquad'
FROM counter c
JOIN counterVersion cv ON cv.id = c.latestVersionId 
JOIN squad csq ON csq.id = c.counterSquadId
JOIN squadVersion csqv ON csqv.id = csq.latestVersionId
JOIN squad osq ON osq.id = c.opponentSquadId
JOIN squadVersion osqv ON osqv.id = osq.latestVersionId
JOIN counterStats cs ON cs.counterId = c.id
JOIN `character` char1 ON char1.id = osqv.toon1Id
JOIN `character` char2 ON char2.id = osqv.toon2Id
JOIN `character` char3 ON char3.id = osqv.toon3Id
JOIN `character` char4 ON char4.id = osqv.toon4Id
JOIN `character` char5 ON char5.id = osqv.toon5Id
JOIN `character` char6 ON char6.id = csqv.toon1Id
JOIN `character` char7 ON char7.id = csqv.toon2Id
JOIN `character` char8 ON char8.id = csqv.toon3Id
JOIN `character` char9 ON char9.id = csqv.toon4Id
JOIN `character` char10 ON char10.id = csqv.toon5Id
WHERE cv.battleType = ?
AND osqv.toon1Id = ?
AND csqv.toon1Id = ?
GROUP BY c.id
ORDER BY totalSeen DESC