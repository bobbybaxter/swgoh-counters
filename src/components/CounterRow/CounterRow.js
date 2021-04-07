/* eslint-disable max-len */
import React, {
  lazy, memo, Suspense, useContext, useEffect, useState,
} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import LazyLoad from 'react-lazyload';

import { useToggle } from 'src/helpers';
import { getCounterStubsBySquadId } from 'src/helpers/data';
import { IDBService } from 'src/setup/IndexedDB';
import { CounterCard } from 'src/styles/style';

import { MiniSquadView, PatreonRowButton, ToonImg } from 'src/components/shared';

import { AuthContext } from 'src/contexts/userContext';
import { AccordionContext } from 'src/contexts/accordionContext';
import CounterRowDescription from './CounterRowDescription';
import {
  CounterRowWrapper, Divider, RightDiv, RightDivWrapper,
} from './style';

const CounterRowSquad = lazy(() => import('./CounterRowSquad'));
const OpponentCard = lazy(() => import('src/components/DescriptionCards/OpponentCard'));
const ModalAddCounter = lazy(() => import('src/components/Modals/ModalAddCounter'));
const ModalPortal = lazy(() => import('src/components/ModalPortal/ModalPortal'));

const CounterRow = ({
  leftSquadStub,
  reload,
  size,
  view,
  ...props
}) => {
  CounterRow.propTypes = {
    leftSquadStub: PropTypes.object.isRequired,
    reload: PropTypes.func.isRequired,
    size: PropTypes.string.isRequired,
    view: PropTypes.string.isRequired,
  };

  const [counterStubs, setCounterStubs] = useState();
  const [isOpen, setIsOpen] = useToggle(false);
  const { isRestricted } = useContext(AuthContext);
  const { toggleCollapse } = useContext(AccordionContext);

  const counterStubId = `${size}_${view}_${leftSquadStub.id}`;

  useEffect(() => {
    // abortController cleans up cancelled requests
    const abortController = new AbortController();
    const opts = { signal: abortController.signal };

    async function getCounterStubs() {
      const storedStubs = await IDBService.get('counterStubs', counterStubId) || {};

      async function removeStaleStubs(counterStub) {
        const { id, counterVersion, rightSquadStubs } = counterStub;
        const staleStubs = rightSquadStubs.filter(x => x.counterCreatedOn > counterVersion);

        if (staleStubs && staleStubs.length > 0) {
          const freshStubs = rightSquadStubs.filter(x => x.counterCreatedOn <= counterVersion);
          const counterStubToStore = {
            id,
            counterVersion,
            rightSquadStubs: freshStubs,
          };
          IDBService.put('counterStubs', counterStubToStore);
          return counterStubToStore;
        }

        return counterStub;
      }

      async function requestCounterStubs() {
        try {
          const stubs = await getCounterStubsBySquadId(leftSquadStub.id, view, size, opts);
          setCounterStubs(stubs);
          if (!_.isEmpty(stubs)) {
            const objectToStore = {
              id: counterStubId,
              counterVersion: stubs.counterVersion,
              rightSquadStubs: stubs.rightSquadStubs,
            };
            IDBService.put('counterStubs', objectToStore);
          }
        } catch (e) {
          if (!abortController.signal.aborted) {
            console.error('requestCounterStubs aborted :>> ', e);
          }
        }
      }

      if (!abortController.signal.aborted && !_.isEmpty(storedStubs) && storedStubs.counterVersion) {
        if (storedStubs.counterVersion !== leftSquadStub.latestCounterVersion) {
          await requestCounterStubs();
        } else {
          const freshStubs = await removeStaleStubs(storedStubs);
          setCounterStubs(freshStubs);
        }
      }

      if (_.isEmpty(storedStubs)) {
        await requestCounterStubs();
      }
    }

    getCounterStubs();
    return () => {
      abortController.abort();
    };
  }, [counterStubId, leftSquadStub, leftSquadStub.id, leftSquadStub.latestCounterVersion, size, view]);

  const toggle = e => toggleCollapse(e.currentTarget.id);
  const hardCounters = !_.isEmpty(counterStubs) ? counterStubs.rightSquadStubs.filter(x => x.isHardCounter) : [];
  const hardCountersToDisplay = !isRestricted
    ? hardCounters
    : hardCounters && _.uniqBy(hardCounters, 'toon1Id');
  const softCounters = !_.isEmpty(counterStubs) ? counterStubs.rightSquadStubs.filter(x => !x.isHardCounter) : [];
  const softCountersToDisplay = !isRestricted ? softCounters : [];
  const restrictedCountersCount = (softCounters.length - softCountersToDisplay.length) + (hardCounters.length - hardCountersToDisplay.length);

  const divider = hardCounters.length > 0 && softCountersToDisplay.length > 0 && <Divider/>;

  const buildCounters = (squads, type) => squads
    .map(squad => <Suspense key={`${view}_${size}_${squad.counterId}_row`} fallback={null}>
        <CounterRowSquad
          squad={squad}
          toggle={toggle}
          type={type}
          view={view}
        />
      </Suspense>);

  const buildCounterDescriptions = !_.isEmpty(counterStubs)
    && counterStubs.rightSquadStubs.map(rightSquadStub => (
      <LazyLoad once key={`CounterRowDescription_${view}_${size}_${rightSquadStub.counterId}`}>
        <CounterRowDescription
          counterStubs={counterStubs}
          reload={reload}
          rightSquadStub={rightSquadStub}
          size={size}
          view={view}
        />
      </LazyLoad>
    ));

  return (
    <CounterRowWrapper>
      <div className="d-flex flex-column">
        <RightDiv className="pt-0">
          <MiniSquadView
            leftSquadStub={leftSquadStub}
            size={size}
            toggle={toggle}
          />
          <RightDivWrapper>
            {hardCountersToDisplay ? buildCounters(hardCountersToDisplay, 'hard') : []}
            {divider}
            {softCountersToDisplay ? buildCounters(softCountersToDisplay, 'soft') : []}
            {isRestricted && restrictedCountersCount > 0 && <PatreonRowButton amount={restrictedCountersCount}/>}
            {!isRestricted
              && view === 'normal'
              ? <>
                  <CounterCard key={`addCounterButton_${counterStubId}`}>
                    <ToonImg
                      alt="Add a new counter"
                      id={`addCounterButton_${counterStubId}`}
                      onClick={() => setIsOpen(true)}
                      src={require('../../assets/Plus.png')}
                      title="Add a new counter"
                    />
                  </CounterCard>
                  {isOpen && (
                    <Suspense fallback={null}>
                      <ModalPortal>
                        <ModalAddCounter
                          counterStubs={counterStubs}
                          isOpen={isOpen}
                          leftSquadStub={leftSquadStub}
                          reload={reload}
                          size={size}
                          toggle={setIsOpen}
                        />
                      </ModalPortal>
                    </Suspense>
                  )}
              </>
              : ''}
          </RightDivWrapper>
        </RightDiv>
      </div>

      {/* Collapsable Opponent Card */}
      {view === 'normal' && (
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <OpponentCard
              leftSquadStub={leftSquadStub}
              reload={reload}
              size={size}
            />
          </Suspense>
        </div>
      )}

      {/* Collapsable Description Card */}
      <div>
        {buildCounterDescriptions}
      </div>
    </CounterRowWrapper>
  );
};

export default memo(CounterRow);
