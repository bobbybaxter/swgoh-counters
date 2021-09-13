const _ = require( 'lodash' );

module.exports = ( { data } ) => ( {
  method: 'GET',
  path: '/squad/stubs/:size',
  handler: async ( request, reply ) => {
    const { size: battleType } = request.params;

    async function addSquadsToStub( leader, stubs ) {
      const leaderSquads = stubs.filter( x => x.toon1Id === leader.toon1Id );
      const leaderSquadIds = leaderSquads.map( x => x.id );
      const counterVersion = leaderSquads.map( x => x.counterVersion ).sort();

      const squads = await data.getMultipleSquadsByIds( leaderSquadIds );

      return ( { ...leader, counterVersion, squads } );
    }

    const normalStubs = await data.leader.getByBattleTypeAndView( battleType, 'normal' );
    const allNormalLeaders = _( normalStubs ).uniqBy( 'toon1Name' ).sortBy( 'toon1Name' );
    const normal = await Promise.all(
      allNormalLeaders.map( async leader => addSquadsToStub( leader, normalStubs )),
    );

    const reverseStubs = await data.leader.getByBattleTypeAndView( battleType, 'reverse' );
    const allReverseLeaders = _( reverseStubs ).uniqBy( 'toon1Name' ).sortBy( 'toon1Name' );
    const reverse = await Promise.all(
      allReverseLeaders.map( async leader => addSquadsToStub( leader, reverseStubs )),
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
                counterVersion: { type: 'array' },
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
                counterVersion: { type: 'array' },
              },
            },
          },
        },
      },
    },
  },
} );
