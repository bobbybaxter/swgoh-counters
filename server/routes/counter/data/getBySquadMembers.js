function buildSquadStatement( squads ) {
  let statement = '(';
  for ( let i = 0; i < squads.length; i += 1 ) {
    statement += i === 0 ? '(' : ' OR (';
    statement += `sv2.toon1Id = '${ squads[ i ].squad[ 0 ] }'`;
    statement += ` AND sv2.toon2Id = '${ squads[ i ].squad[ 1 ] }'`;
    statement += ` AND sv2.toon3Id = '${ squads[ i ].squad[ 2 ] }'`;
    statement += ` AND sv2.toon4Id = '${ squads[ i ].squad[ 3 ] }'`;
    statement += ` AND sv2.toon5Id = '${ squads[ i ].squad[ 4 ] }'`;
    statement += ')';
  }
  statement += ')';
  return statement;
}

module.exports = ( { database, log } ) => ( squads, view, size ) => {
  let leftSquad, rightSquad;

  if ( view === 'normal' ) {
    rightSquad = 'counterSquadId';
    leftSquad = 'opponentSquadId';
  } else if ( view === 'reverse' ) {
    rightSquad = 'opponentSquadId';
    leftSquad = 'counterSquadId';
  }

  const sql = `
    SELECT
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
      sv.name,
      sv.toon1Id,
      sv.createdOn AS 'squadCreatedOn',
      sv.createdById AS 'squadCreatedById',
      sv.createdByName AS 'squadCreatedByName'
    FROM counter c
    JOIN counterVersion cv ON c.latestVersionId = cv.id
    JOIN counterStats cs ON cs.counterId = c.id
    JOIN squad s ON ${ rightSquad } = s.id
    JOIN squadVersion sv ON s.latestVersionId  = sv.id
    JOIN squad s2 ON ${ leftSquad } = s2.id
    JOIN squadVersion sv2 ON s2.latestVersionId  = sv2.id
    JOIN \`character\` ch on sv.toon1Id = ch.id
    WHERE cv.battleType = '${ size }'
    -- AND cs.seen > 50
    AND ${ buildSquadStatement( squads ) }
    GROUP BY c.id
    ORDER BY ch.name, cs.seen DESC;
  `;

  return new Promise(( res, rej ) => {
    database.query( sql, ( error, results ) => {
      if ( error ) { rej( error ); }

      if ( !results || ( results && !results.length )) {
        log.warn( `Counter stub doesn't exist for ${ view } ${ size } counter for id: ${ squads[ 0 ].toon1Id }` );
        return res( [] );
      }

      return res( JSON.parse( JSON.stringify( results )));
    } );
  } ).catch( err => {
    throw err;
  } );
};
