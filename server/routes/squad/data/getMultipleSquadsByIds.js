function buildStatement(squadIds) {
  let statement = `(s.id = '${squadIds[0]}'`;
  if (squadIds.length > 1) {
    for (let i = 1; i < squadIds.length; i += 1) {
      statement += ` OR s.id ='${squadIds[i]}'`;
    }
  }
  statement += ')';
  return statement;
}

module.exports = ({ database, log }) => squadIds => {
  const sql = `
  SELECT
    s.id,
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
    s.latestVersionId,
    sv.createdOn,
    sv.createdById,
    sv.createdByName
  FROM squad s
  JOIN squadVersion sv ON sv.id = s.latestVersionId
  JOIN \`character\` char1 ON char1.id = sv.toon1Id
  JOIN \`character\` char2 ON char2.id = sv.toon2Id
  JOIN \`character\` char3 ON char3.id = sv.toon3Id
  JOIN \`character\` char4 ON char4.id = sv.toon4Id
  JOIN \`character\` char5 ON char5.id = sv.toon5Id
  WHERE ${buildStatement(squadIds)};
  `;

  return new Promise((res, rej) => {
    database.query(sql, (error, results) => {
      if (error) { rej(error); }

      if (!results || (results && !results.length)) {
        log.warn(`Get Multiple Squads By Id: Squad doesn't exist for id: ${squadIds}`);
        return res([]);
      }

      return res(JSON.parse(JSON.stringify(results)));
    });
  }).catch(e => {
    throw e;
  });
};
