function buildStatement(squadIds) {
  let statement = `(s2.id = '${squadIds[0]}'`;
  if (squadIds.length > 1) {
    for (let i = 1; i < squadIds.length; i += 1) {
      statement += ` OR s2.id ='${squadIds[i]}'`;
    }
  }
  statement += ')';
  return statement;
}

module.exports = ({ database, log }) => (squadIds, view, size) => {
  let leftSquad, rightSquad;

  if (view === 'normal') {
    rightSquad = 'counterSquadId';
    leftSquad = 'opponentSquadId';
  } else if (view === 'reverse') {
    rightSquad = 'opponentSquadId';
    leftSquad = 'counterSquadId';
  }

  const sql = `
    SELECT
      SUM(cs.seen) AS totalSeen,
      ROUND( AVG(cs.winPerc), 2) as avgWin,
      c.id,
      c.opponentSquadId,
      c.counterSquadId,
      c.latestVersionId,
      cv.isHardCounter,
      cv.battleType,
      cv.counterStrategy,
      cv.isToon2Req,
      cv.isToon3Req,
      cv.isToon4Req,
      cv.isToon5Req,
      cv.toon1Zetas,
      cv.toon2Zetas,
      cv.toon3Zetas,
      cv.toon4Zetas,
      cv.toon5Zetas,
      cv.createdOn AS 'counterCreatedOn',
      cv.createdById AS 'counterCreatedById',
      cv.createdByName AS 'counterCreatedByName',
      s.id AS 'squadId',
      sv.name,
      sv.toon1Id,
      char1.name as 'toon1Name',
      sv.toon2Id,
      char2.name as 'toon2Name',
      sv.toon3Id,
      char3.name as 'toon3Name',
      sv.toon4Id,
      char4.name as 'toon4Name',
      sv.toon5Id,
      char5.name as 'toon5Name',
      sv.description,
      sv.generalStrategy,
      sv.createdOn AS 'squadCreatedOn',
      sv.createdById AS 'squadCreatedById',
      sv.createdByName AS 'squadCreatedByName'
    FROM counter c
    JOIN counterVersion cv ON c.latestVersionId = cv.id
    JOIN counterStats cs ON cs.counterId = c.id
    JOIN squad s ON ${rightSquad} = s.id
    JOIN squadVersion sv ON s.latestVersionId  = sv.id
    JOIN squad s2 ON ${leftSquad} = s2.id
    JOIN squadVersion sv2 ON s2.latestVersionId  = sv2.id
    JOIN \`character\` char1 ON char1.id = sv.toon1Id
    JOIN \`character\` char2 ON char2.id = sv.toon2Id
    JOIN \`character\` char3 ON char3.id = sv.toon3Id
    JOIN \`character\` char4 ON char4.id = sv.toon4Id
    JOIN \`character\` char5 ON char5.id = sv.toon5Id
    WHERE cv.battleType = '${size}'
    AND cs.seen > 10
    AND ${buildStatement(squadIds)}
    GROUP BY c.id
    ORDER BY char1.name, totalSeen DESC;
  `;

  return new Promise((res, rej) => {
    database.query(sql, (error, results) => {
      if (error) { rej(error); }

      if (!results || (results && !results.length)) {
        log.warn(`Counter stub doesn't exist for ${view} ${size} counter for id: ${squadIds}`);
        return res([]);
      }

      return res(JSON.parse(JSON.stringify(results)));
    });
  }).catch(err => {
    throw err;
  });
};
