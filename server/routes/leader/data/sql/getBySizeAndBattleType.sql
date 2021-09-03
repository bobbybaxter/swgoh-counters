SELECT
	l.squadId AS 'id',
	sv.toon1Id,
	c.name AS 'toon1Name'
FROM leader l
JOIN squad s ON s.id = l.squadId 
JOIN squadVersion sv ON sv.id = s.latestVersionId 
JOIN `character` c ON c.id = sv.toon1Id
WHERE l.battletype = ?
AND l.view = ?;