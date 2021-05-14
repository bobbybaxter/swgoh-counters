/* eslint-disable max-len */
import React, {
  lazy, Suspense, useContext,
} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import LazyLoad from 'react-lazyload';

import { useToggle } from 'src/helpers';
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
  anyExcludedLeaders,
  counters,
  leftSquad,
  reload,
  size,
  view,
  ...props
}) => {
  CounterRow.propTypes = {
    anyExcludedLeaders: PropTypes.bool.isRequired,
    counters: PropTypes.array.isRequired,
    leftSquad: PropTypes.object.isRequired,
    reload: PropTypes.func.isRequired,
    size: PropTypes.string.isRequired,
    view: PropTypes.string.isRequired,
  };

  const [isOpen, setIsOpen] = useToggle(false);
  const { isActivePatron, isRestricted, user } = useContext(AuthContext);
  const { toggleCollapse } = useContext(AccordionContext);

  const counterStubId = `${size}_${view}_${leftSquad.id}`;

  const toggle = e => toggleCollapse(e.currentTarget.id);
  const hardCounters = !_.isEmpty(counters) ? counters.filter(x => x.isHardCounter) : [];
  const hardCountersToDisplay = !isRestricted
    ? hardCounters
    : hardCounters && _.uniqBy(hardCounters, 'toon1Id');
  const softCounters = !_.isEmpty(counters) ? counters.filter(x => !x.isHardCounter) : [];
  const softCountersToDisplay = !isRestricted ? softCounters : [];
  const restrictedCountersCount = (softCounters.length - softCountersToDisplay.length) + (hardCounters.length - hardCountersToDisplay.length);

  const divider = hardCounters.length > 0 && softCountersToDisplay.length > 0 && <Divider/>;

  const buildCounters = (squads, type) => squads
    .map(squad => <Suspense key={`${view}_${size}_${squad.id}_row`} fallback={null}>
      <CounterRowSquad
        squad={squad}
        toggle={toggle}
        type={type}
        view={view}
      />
    </Suspense>);

  const buildCounterDescriptions = counters.map(rightSquadStub => (
    <LazyLoad once key={`CounterRowDescription_${view}_${size}_${rightSquadStub.id}`}>
      <CounterRowDescription
        counterStubs={counters}
        leftSquad={leftSquad}
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
            leftSquadStub={leftSquad}
            size={size}
            toggle={toggle}
          />
          <RightDivWrapper>
            {hardCountersToDisplay ? buildCounters(hardCountersToDisplay, 'hard') : []}
            {divider}
            {softCountersToDisplay ? buildCounters(softCountersToDisplay, 'soft') : []}
            {isRestricted && restrictedCountersCount > 0 && <PatreonRowButton amount={restrictedCountersCount}/>}
            {isActivePatron
              && view === 'normal'
              && user.allyCode
              && !anyExcludedLeaders
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
                          counterStubs={counters}
                          isOpen={isOpen}
                          leftSquadStub={leftSquad}
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
            leftSquadStub={leftSquad}
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

export default CounterRow;
