function buildLeaderStatement(leaderIds, type) {
  const squad = type === 'normal' ? 'sv' : 'sv2';
  let statement = `(${squad}.toon1Id = '${leaderIds[0]}'`;
  for (let i = 1; i < leaderIds.length; i += 1) {
    statement += ` OR ${squad}.toon1Id ='${leaderIds[i]}'`;
  }
  statement += ')';
  return statement;
}

module.exports = ({ database, log }) => (type, leaders, size) => {
  const leftSideSquad = type === 'normal' ? 'opponentSquadId' : 'counterSquadId';
  const rightSideSquad = type === 'normal' ? 'counterSquadId' : 'opponentSquadId';
  const leaderIds = leaders.map(leader => leader.id);

  const newSqlQuery = `
    SELECT
      sv.toon1Id as 'toon1Id',
      ch.name as 'toon1Name',
      GREATEST(MAX(sv.createdOn), MAX(cv.createdOn), MAX(sv2.createdOn)) AS latestCounterVersion
    FROM squad s
    JOIN squadVersion sv ON s.latestVersionId = sv.id
    JOIN counter c ON ${leftSideSquad} = s.id
    JOIN counterVersion cv ON c.latestVersionId = cv.id 
    JOIN squad s2 ON ${rightSideSquad} = s2.id
    JOIN squadVersion sv2 ON s2.latestVersionId = sv2.id
    JOIN \`character\` ch ON sv.toon1Id = ch.id
    WHERE cv.battleType = '${size}'
    AND ${buildLeaderStatement(leaderIds, type)}
    GROUP BY sv.toon1Id
    ORDER BY ch.name, sv.name
    -- LIMIT 2
  `;

  return new Promise((res, rej) => {
    database.query(newSqlQuery, (error, results) => {
      if (error) { rej(error); }

      if (!results || (results && !results.length)) {
        log.warn('Squad database is empty');
        return res({});
      }

      return res(JSON.parse(JSON.stringify(results)));
    });
  }).catch(err => {
    throw err;
  });
};
