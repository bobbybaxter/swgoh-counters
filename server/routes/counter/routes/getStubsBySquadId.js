/* eslint-disable max-len */
const _ = require( 'lodash' );

module.exports = ( { data } ) => ( {
  method: 'GET',
  path: '/counter/getStubsBySquadIds/:id',
  handler: async ( request, reply ) => {
    let stubs;
    const { view, size, squadIds } = request.query;

    const squadIdsArray = squadIds.split( ',' );
    const res = await data.getByMultipleSquadIds( squadIdsArray, view, size );
    const allStubs = res.filter( x => x.avgWin >= 0.75 );

    function pickFirstStubForEachOpponentSquad( stubsToFilter ) {
      const separatedStubs = [];
      const squadToMatch = view === 'normal' ? 'opponentSquadId' : 'counterSquadId';
      for ( let i = 0; i < squadIdsArray.length; i += 1 ) {
        const newSquadArray = stubsToFilter.filter( stub => stub[ squadToMatch ] === squadIdsArray[ i ] );
        const uniqueSquads = _.uniqBy( newSquadArray, 'toon1Id' );
        uniqueSquads.forEach( squad => separatedStubs.push( squad ));
      }
      return separatedStubs;
    }

    if ( squadIdsArray.length > 1 ) {
      stubs = pickFirstStubForEachOpponentSquad( allStubs );
    } else {
      stubs = _.uniqBy( allStubs, 'toon1Id' );
    }

    const leaderSquads = await Promise.all( squadIdsArray.map( async squadId => {
      const response = await data.leader.getSingleLeader( [ squadId, size, view ] );
      return response;
    } ));
    const leaderVersion = leaderSquads.map( x => x.leaderVersion ).sort();

    // adds video links and splits zetas
    const rightSquadStubs = await Promise.all( stubs.map( async x => {
      const newX = { ...x };
      const videoLinks = await data.videoLink.getBySubjectId( newX.id );
      newX.videoLinks = videoLinks;
      newX.toon1Zetas = newX.toon1Zetas ? newX.toon1Zetas.split( ',' ) : [];
      newX.toon2Zetas = newX.toon2Zetas ? newX.toon2Zetas.split( ',' ) : [];
      newX.toon3Zetas = newX.toon3Zetas ? newX.toon3Zetas.split( ',' ) : [];
      newX.toon4Zetas = newX.toon4Zetas ? newX.toon4Zetas.split( ',' ) : [];
      newX.toon5Zetas = newX.toon5Zetas ? newX.toon5Zetas.split( ',' ) : [];

      return newX;
    } ));

    reply.type( 'application/json' );

    if ( !_.isEmpty( rightSquadStubs )) {
      return reply.send( { counterVersion: leaderVersion, rightSquadStubs } );
    }

    return reply.send( { rightSquadStubs } );
  },
  schema: {
    params: {
      id: { type: 'string' },
    },
    queryStrings: {
      view: { type: 'string' },
      size: { type: 'string' },
    },
    response: {
      '2xx': {
        type: 'object',
        properties: {
          counterVersion: { type: 'array' },
          rightSquadStubs: {
            type: 'array',
            items: {
              properties: {
                id: { type: 'string' },
                totalSeen: { type: 'integer' },
                opponentSquadId: { type: 'string' },
                counterSquadId: { type: 'string' },
                latestVersionId: { type: 'string' },
                isHardCounter: { type: 'boolean' },
                battleType: { type: 'string' },
                counterStrategy: { type: 'string' },
                isToon2Req: { type: 'boolean' },
                isToon3Req: { type: 'boolean' },
                isToon4Req: { type: 'boolean' },
                isToon5Req: { type: 'boolean' },
                toon1Zetas: { type: 'array' },
                toon2Zetas: { type: 'array' },
                toon3Zetas: { type: 'array' },
                toon4Zetas: { type: 'array' },
                toon5Zetas: { type: 'array' },
                counterCreatedOn: { type: 'string' },
                counterCreatedById: { type: 'string' },
                counterCreatedByName: { type: 'string' },
                squadId: { type: 'string' },
                name: { type: 'string' },
                toon1Id: { type: 'string' },
                toon1Name: { type: 'string' },
                toon2Id: { type: 'string' },
                toon2Name: { type: 'string' },
                toon3Id: { type: 'string' },
                toon3Name: { type: 'string' },
                toon4Id: { type: 'string' },
                toon4Name: { type: 'string' },
                toon5Id: { type: 'string' },
                toon5Name: { type: 'string' },
                description: { type: 'string' },
                generalStrategy: { type: 'string' },
                squadCreatedOn: { type: 'string' },
                squadCreatedById: { type: 'string' },
                squadCreatedByName: { type: 'string' },
                videoLinks: { type: 'array' },
              },
            },
          },
        },
      },
    },
  },
} );
