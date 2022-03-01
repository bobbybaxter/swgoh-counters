function buildStatement( type, squad ) {
  let statement;
  const prefix = type === 'defense' ? 'sv' : 'sv2';

  squad.forEach(( toon, index ) => {
    const { id } = toon;
    if ( index === 0 ) {
      statement = `${ prefix }.toon1Id = '${ id }'`;
    } else if ( toon.id !== 'BLANK' ) {
      statement += ` AND (${ prefix }.toon2Id = '${ id }' OR ${ prefix }.toon3Id = '${ id }' OR ${ prefix }.toon4Id = '${ id }' OR ${ prefix }.toon5Id = '${ id }')`;
    }
  } );

  return statement;
}

module.exports = ( { database, log } ) => async ( {
  battleType,
  selectedSeason,
  squadPosition,
  squad,
} ) => {
  const sql = `
    SELECT
      c.id,
      SUM(cs.seen) AS totalSeen,
      ROUND( AVG(cs.winPerc), 2) as avgWin,
      ROUND( AVG(cs.avgBanners), 0) as avgBanners,
      JSON_ARRAY(
        JSON_OBJECT("id", sv.toon1Id, "name", char1.name),
        JSON_OBJECT("id", sv.toon2Id, "name", char2.name),
        JSON_OBJECT("id", sv.toon3Id, "name", char3.name),
        JSON_OBJECT("id", sv.toon4Id, "name", char4.name),
        JSON_OBJECT("id", sv.toon5Id, "name", char5.name)
      ) as "opponentSquad",
      JSON_ARRAY(
        JSON_OBJECT("id", sv2.toon1Id, "name", char6.name),
        JSON_OBJECT("id", sv2.toon2Id, "name", char7.name),
        JSON_OBJECT("id", sv2.toon3Id, "name", char8.name),
        JSON_OBJECT("id", sv2.toon4Id, "name", char9.name),
        JSON_OBJECT("id", sv2.toon5Id, "name", char10.name)
      ) as "counterSquad"
    FROM counter c
    JOIN counterVersion cv ON cv.id = c.latestVersionId 
    JOIN squad s ON s.id = c.opponentSquadId
    JOIN squadVersion sv ON sv.id = s.latestVersionId 
    JOIN squad s2 ON s2.id = c.counterSquadId 
    JOIN squadVersion sv2 ON sv2.id = s2.latestVersionId
    JOIN \`character\` char1 ON char1.id = sv.toon1Id
    JOIN \`character\` char2 ON char2.id = sv.toon2Id
    JOIN \`character\` char3 ON char3.id = sv.toon3Id
    JOIN \`character\` char4 ON char4.id = sv.toon4Id
    JOIN \`character\` char5 ON char5.id = sv.toon5Id
    JOIN \`character\` char6 ON char6.id = sv2.toon1Id
    JOIN \`character\` char7 ON char7.id = sv2.toon2Id
    JOIN \`character\` char8 ON char8.id = sv2.toon3Id
    JOIN \`character\` char9 ON char9.id = sv2.toon4Id
    JOIN \`character\` char10 ON char10.id = sv2.toon5Id
    JOIN counterStats cs ON cs.counterId = c.id
    WHERE battleType = '${ battleType }'
    AND cs.season >= ${ selectedSeason }
    AND ${ buildStatement( squadPosition, squad ) }
    GROUP BY c.id
    ORDER BY totalSeen DESC
  `;

  return new Promise(( res, rej ) => {
    database.query( sql, ( error, results ) => {
      if ( error ) { rej( error ); }

      if ( !results || ( results && !results.length )) {
        log.warn( 'Counter stub doesn\'t exist for this counter' );
        return res( [] );
      }

      const parsedResults = results.map( row => ( {
        ...row,
        opponentSquad: JSON.parse( row.opponentSquad ),
        counterSquad: JSON.parse( row.counterSquad ),
      } ));

      return res( parsedResults );
    } );
  } ).catch( err => {
    throw err;
  } );
};
