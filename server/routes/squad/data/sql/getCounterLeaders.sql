SELECT
	sv.toon1Id as 'id',
	ch.name
FROM counter c 
JOIN counterVersion cv ON c.latestVersionId = cv.id
JOIN squad s ON ?? = s.id 
JOIN squadVersion sv ON s.latestVersionId = sv.id
JOIN `character` ch ON sv.toon1Id = ch.id
WHERE battleType = ?
GROUP BY sv.toon1Id
ORDER BY ch.name