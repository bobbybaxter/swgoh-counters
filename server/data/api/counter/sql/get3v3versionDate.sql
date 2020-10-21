SELECT MAX(createdOn) as 'lastUpdate'
FROM counterVersion
WHERE battleType = '3v3';