// TODO: remove GOOGLE_SHEET_ID and GOOGLE_API_KEY from AWS

module.exports = ( { data } ) => ( {
  method: 'GET',
  path: '/squad/stubs/:size',
  handler: async ( request, reply ) => {
    const { size } = request.params;

    async function addSquadsToStub( stub, leaderSquads ) {
      const leaderSquadIds = leaderSquads
        .filter( x => x.toon1Id === stub.toon1Id )
        .map( x => x.id );
      const squads = await data.getMultipleSquadsByIds( leaderSquadIds );

      return ( { ...stub, squads } );
    }

    const allLeaderSquads = await data.leader.getBySizeAndBattleType( size, 'normal' );
    const normalStubs = await data.getStubs( 'normal', allLeaderSquads, size );
    const normal = await Promise.all(
      normalStubs.map( async stub => addSquadsToStub( stub, allLeaderSquads )),
    );

    const allLeaderSquadsReverse = await data.leader.getBySizeAndBattleType( size, 'reverse' );
    const reverseStubs = await data.getStubs( 'reverse', allLeaderSquadsReverse, size );
    const reverse = await Promise.all(
      reverseStubs.map( async stub => addSquadsToStub( stub, allLeaderSquadsReverse )),
    );

    reply
      .type( 'application/json' )
      .send( { normal, reverse } );
  },
  schema: {
    params: {
      size: { type: 'string' },
    },
    response: {
      '2xx': {
        type: 'object',
        properties: {
          normal: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                toon1Id: { type: 'string' },
                toon1Name: { type: 'string' },
                squads: { type: 'array' },
                latestCounterVersion: { type: 'string' },
              },
            },
          },
          reverse: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                toon1Id: { type: 'string' },
                toon1Name: { type: 'string' },
                squads: { type: 'array' },
                latestCounterVersion: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
} );
