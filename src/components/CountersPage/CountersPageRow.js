import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { IDBService } from 'src/setup/IndexedDB';

import { getCounterStubsBySquadIds } from 'src/helpers/data';

import CounterRow from 'src/components/CounterRow/CounterRow';

import {
  RightDiv, RightDivWrapper,
} from '../CounterRow/style';

export default function CountersPageRow( {
  anyExcludedLeaders,
  excludedCounters,
  leaderId,
  reload,
  size,
  stubs,
  view,
  ...props
} ) {
  CountersPageRow.propTypes = {
    anyExcludedLeaders: PropTypes.bool.isRequired,
    excludedCounters: PropTypes.array.isRequired,
    leaderId: PropTypes.string.isRequired,
    reload: PropTypes.func.isRequired,
    size: PropTypes.string.isRequired,
    stubs: PropTypes.object.isRequired,
    view: PropTypes.string.isRequired,
  };

  const [ counters, setCounters ] = useState( [] );

  const counterStubId = !_.isEmpty( stubs.squads ) && `${ size }_${ view }_${ stubs.squads[ 0 ].toon1Id }`;

  useEffect(() => {
    // abortController cleans up cancelled requests
    const abortController = new AbortController();
    const opts = { signal: abortController.signal };

    async function getCountersForLeader() {
      const storedStubs = await IDBService.get( 'counterStubs', counterStubId ) || {};

      async function removeStaleStubs( counterStub ) {
        const { id, counterVersion, rightSquadStubs } = counterStub;
        const staleStubs = rightSquadStubs.filter( x => x.counterCreatedOn > counterVersion );

        if ( staleStubs && staleStubs.length > 0 ) {
          const freshStubs = rightSquadStubs.filter( x => x.counterCreatedOn <= counterVersion );
          const counterStubToStore = {
            id,
            counterVersion,
            rightSquadStubs: freshStubs,
          };
          IDBService.put( 'counterStubs', counterStubToStore );
          return counterStubToStore;
        }

        return counterStub;
      }

      async function requestCounters() {
        try {
          const squadIds = stubs.squads.map( x => x.id );
          const response = await getCounterStubsBySquadIds( leaderId, squadIds, view, size, opts );
          setCounters( response );
          if ( !_.isEmpty( response )) {
            const objectToStore = {
              id: counterStubId,
              counterVersion: response.counterVersion,
              rightSquadStubs: response.rightSquadStubs,
            };
            IDBService.put( 'counterStubs', objectToStore );
          }
        } catch ( e ) {
          if ( !abortController.signal.aborted ) {
            console.error( 'requestCounterStubs aborted :>> ', e );
          }
        }
      }

      // eslint-disable-next-line max-len
      if ( !abortController.signal.aborted && !_.isEmpty( storedStubs ) && storedStubs.counterVersion ) {
        if ( storedStubs.counterVersion !== stubs.latestCounterVersion ) {
          await requestCounters();
        } else {
          const freshStubs = await removeStaleStubs( storedStubs );
          setCounters( freshStubs );
        }
      }

      if ( _.isEmpty( storedStubs )) {
        await requestCounters();
      }
    }

    getCountersForLeader();
    return () => {
      abortController.abort();
    };
  }, [ counterStubId, leaderId, size, stubs.latestCounterVersion, stubs.squads, view ] );

  const separatedLeaderSquadIds = !_.isEmpty( counters ) && _.uniq(
    counters.rightSquadStubs.map( x => ( view === 'normal' ? x.opponentSquadId : x.counterSquadId )),
  );

  const sortedLeaderSquads = separatedLeaderSquadIds
    && separatedLeaderSquadIds
      .map( id => stubs.squads.find( leaderSquad => leaderSquad.id === id ))
      .sort(( a, b ) => ( a.toon1Name > b.toon1Name ? 1 : -1 ));

  const buildCounterRows = sortedLeaderSquads
    ? sortedLeaderSquads.map( squad => {
      const rightSquads = squad && !_.isEmpty( counters ) && counters.rightSquadStubs
        .filter( x => !excludedCounters.includes( x.toon1Id ))
        .filter( x => ( view === 'normal' ? x.opponentSquadId : x.counterSquadId ) === squad.id )
        .sort(( a, b ) => ( a.totalSeen < b.totalSeen ? 1 : -1 ));

      return (
        squad && !_.isEmpty( rightSquads )
          ? <CounterRow
          anyExcludedLeaders={anyExcludedLeaders}
          key={`CounterRow_${ view }_${ size }_${ squad.id }`}
          leftSquad={squad}
          counters={rightSquads}
          size={size}
          reload={reload}
          view={view}
        />
          : ''
      );
    } )
    : [];

  return (
    <>
      {!_.isEmpty( buildCounterRows.filter( x => x !== '' ))
        ? <div className="d-flex flex-column p-0 col-10">
            {buildCounterRows}
          </div>
        : <RightDiv>
            <RightDivWrapper></RightDivWrapper>
          </RightDiv>
      }
    </>
  );
}
