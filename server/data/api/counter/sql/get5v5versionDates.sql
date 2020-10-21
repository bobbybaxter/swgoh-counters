SELECT MAX(createdOn) as 'lastUpdate'
FROM counterVersion
WHERE battleType = '5v5';