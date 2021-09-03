SELECT
	l.squadId AS 'id',
	l.battleType,
	l.view,
	char1.name as 'toon1Name',
	sv.toon1Id,
	sv.toon2Id,
	sv.toon3Id,
	sv.toon4Id,
	sv.toon5Id
FROM leader l
LEFT JOIN squad s ON s.id = l.squadId 
LEFT JOIN squadVersion sv ON sv.id = s.latestVersionId 
LEFT JOIN `character` char1 ON char1.id = sv.toon1Id
LEFT JOIN `character` char2 ON char2.id = sv.toon2Id
LEFT JOIN `character` char3 ON char3.id = sv.toon3Id
LEFT JOIN `character` char4 ON char4.id = sv.toon4Id
LEFT JOIN `character` char5 ON char5.id = sv.toon5Id
ORDER BY toon1Name;