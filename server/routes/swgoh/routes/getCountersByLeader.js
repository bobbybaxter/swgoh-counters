const _ = require( 'lodash' );

module.exports = app => ( {
  method: 'GET',
  path: '/swgoh/counters/:season',
  handler: async ( request, reply ) => {
    const { config, data, log } = app;
    const { season } = request.params;

    const seasons5v5 = [ 10, 11, 13, 15, 17, 19, 21, 23, 24 ];
    const seasons3v3 = [ 9, 12, 14, 16, 18, 20, 22 ];

    function selectBattleTypeBySeason( seasonNum ) {
      if ( seasons3v3.includes( seasonNum )) { return '3v3'; }
      if ( seasons5v5.includes( seasonNum )) { return '5v5'; }
      return '';
    }

    async function determineCounterStrength( { counterId, winPerc } ) {
      let percToTest;
      const res = await data.counterStats.getAvgWinPerc( counterId );

      if ( _.isEmpty( res )) {
        return null;
      }

      if ( res.season < season ) {
        percToTest = ( res.sumWinPerc + winPerc ) / ( res.counterNum + 1 );
      } else {
        percToTest = res.avgWinPerc;
      }

      return percToTest >= 0.90 ? 1 : 0;
    }

    async function checkAndCreateCounter( {
      existingCounterSquadId,
      existingOpponentSquadId,
      incomingCounter,
      parsedWinPerc,
    } ) {
      const { counterSquadId, opponentSquadId, battleType } = incomingCounter;
      const existingCounter = await data.counter.getBySquads(
        [ existingCounterSquadId, existingOpponentSquadId ],
      );

      if ( _.isEmpty( existingCounter )) {
        const createdCounterId = await data.counter.create( incomingCounter );

        if ( createdCounterId ) { // updates leaderVersion for the squads in this counter
          const opponentLeader = await data.leader.getSingleLeader( [ opponentSquadId, battleType, 'normal' ] );
          !_.isEmpty( opponentLeader ) && await data.leader.updateVersion( opponentLeader.id );
          const counterLeader = await data.leader.getSingleLeader( [ counterSquadId, battleType, 'reverse' ] );
          !_.isEmpty( counterLeader ) && await data.leader.updateVersion( counterLeader.id );
        }

        return createdCounterId;
      }

      const newCounter = {
        ...existingCounter,
        isHardCounter: await determineCounterStrength( {
          counterId: existingCounter.id,
          winPerc: parsedWinPerc,
        } ) || incomingCounter.isHardCounter,
        userId: incomingCounter.userId,
        username: incomingCounter.username,
      };

      const updateNeeded = !_.isEqual(
        _.omit( existingCounter, [ 'createdById', 'createdByName', 'userId', 'username' ] ),
        _.omit( newCounter, [ 'createdById', 'createdByName', 'userId', 'username' ] ),
      );

      if ( updateNeeded ) {
        const updateResponse = await data.counter.update( newCounter );

        if ( updateResponse === 'ok' ) {
          const opponentLeader = await data.leader.getSingleLeader( [ opponentSquadId, battleType, 'normal' ] );
          !_.isEmpty( opponentLeader ) && await data.leader.updateVersion( opponentLeader.id );
          const counterLeader = await data.leader.getSingleLeader( [ counterSquadId, battleType, 'reverse' ] );
          !_.isEmpty( counterLeader ) && await data.leader.updateVersion( counterLeader.id );
        }
      } else {
        log.debug( `Counter updated not needed for ${ existingCounter.id }` );
      }

      log.info( `Counter exists for (counter, opponent): ${ counterSquadId }, ${ opponentSquadId }` );
      return existingCounter.id;
    }

    async function checkAndCreateCounterStats( incomingCounterStats ) {
      const { counterId } = incomingCounterStats;
      const existingCounterStats = await data.counterStats.getByCounterIdAndSeason(
        { counterId, season },
      );

      if ( _.isEmpty( existingCounterStats )) {
        const createdCounterStatsId = await data.counterStats.create( incomingCounterStats );
        return createdCounterStatsId;
      }

      const updateNeeded = !_.isEqual(
        _.omit( existingCounterStats, [ 'id' ] ),
        incomingCounterStats,
      );

      if ( updateNeeded ) {
        await data.counterStats.updateByCounterId( existingCounterStats, incomingCounterStats );
      } else {
        log.debug( `CounterStats update not needed for ${ counterId }` );
      }

      log.info( `CounterStats exist for: ${ counterId }` );
      return existingCounterStats.id;
    }

    async function buildCounters( swgohInfo ) {
      Promise.all( swgohInfo
        .map( async counter => {
          const {
            counterSquad, opponentSquad, seen, winPerc, avgBanners,
          } = counter;
          // finds existing squads
          const existingCounterSquad = await data.squad.getBySquadMembers( counterSquad );
          const existingOpponentSquad = await data.squad.getBySquadMembers( opponentSquad );
          const existingCounterSquadId = existingCounterSquad.id;
          const existingOpponentSquadId = existingOpponentSquad.id;

          if ( _.isEmpty( existingCounterSquad ) || !existingCounterSquad ) {
            return log.warn( `Existing Counter Squad not found for ${ JSON.stringify( counterSquad ) }` );
          }

          if ( _.isEmpty( existingOpponentSquad ) || !existingOpponentSquad ) {
            return log.warn( `Existing Opponent Squad not found for ${ JSON.stringify( opponentSquad ) }` );
          }

          const parsedWinPerc = parseFloat(( parseFloat( winPerc ) / 100.0 ).toFixed( 3 ));

          // creates counters if they don't exist
          const incomingCounter = {
            opponentSquadId: existingOpponentSquadId,
            counterSquadId: existingCounterSquadId,
            isHardCounter: parsedWinPerc >= 0.90 ? 1 : 0,
            battleType: selectBattleTypeBySeason( season ),
            counterStrategy: '',
            isToon2Req: false,
            isToon3Req: false,
            isToon4Req: false,
            isToon5Req: false,
            toon1Zetas: '',
            toon2Zetas: '',
            toon3Zetas: '',
            toon4Zetas: '',
            toon5Zetas: '',
            userId: config.userId,
            username: config.username,
          };

          const counterId = await checkAndCreateCounter( {
            existingCounterSquadId,
            existingOpponentSquadId,
            incomingCounter,
            parsedWinPerc,
          } );

          if ( counterId ) {
            const incomingCounterStats = {
              counterId,
              season,
              seen: parseInt( seen, 10 ),
              winPerc: parsedWinPerc,
              avgBanners: parseInt( avgBanners, 10 ),
            };

            await checkAndCreateCounterStats( incomingCounterStats );
          }

          return '';
        } ));
    }

    const swgohInfo = await data.getSeasonDataFromAws( season );

    if ( swgohInfo ) {
      await buildCounters( JSON.parse( swgohInfo ));
    }

    reply.send( 'ok' );
  },
  schema: {
    params: {
      season: { type: 'integer' },
    },
    response: {
      '2xx': { type: 'string' },
    },
  },
} );
