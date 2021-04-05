SELECT
	s.id,
	sv.name,
  sv.toon1Id,
  sv.toon2Id,
  sv.toon3Id,
  sv.toon4Id,
  sv.toon5Id,
	c2.latestCounterVersion
FROM squad s
JOIN squadVersion sv ON s.latestVersionId = sv.id
JOIN (SELECT ??, MAX(cv.createdOn) AS 'latestCounterVersion'
	FROM counter c
	JOIN counterVersion cv ON c.latestVersionId = cv.id
	WHERE battleType = ?
	GROUP BY ??) c2 ON ?? = s.id
ORDER BY sv.name
-- LIMIT 2