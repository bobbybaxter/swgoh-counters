SELECT
	s.id,
	s.name,
	c2.createdOn
FROM squad s
JOIN (SELECT ??, MAX(cv.createdOn) AS 'createdOn'
	FROM counter c
	JOIN counterVersion cv ON c.latestVersionId = cv.id
	WHERE battleType = ?
	GROUP BY ??) c2 ON ?? = s.id
ORDER BY s.name