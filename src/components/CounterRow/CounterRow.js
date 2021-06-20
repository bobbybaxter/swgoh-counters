import React, {
  lazy, Suspense, useContext,
} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import LazyLoad from 'react-lazyload';

import { MiniSquadView } from 'src/components/shared';

import { AccordionContext } from 'src/contexts/accordionContext';
import CounterRowDescription from './CounterRowDescription';

import {
  CounterRowWrapper, Divider, RightDiv, RightDivWrapper,
} from './style';

const CounterRowSquad = lazy(() => import( './CounterRowSquad' ));
const OpponentCard = lazy(() => import( 'src/components/DescriptionCards/OpponentCard' ));

const CounterRow = ( {
  anyExcludedLeaders,
  counters,
  leftSquad,
  reload,
  size,
  view,
  ...props
} ) => {
  CounterRow.propTypes = {
    anyExcludedLeaders: PropTypes.bool.isRequired,
    counters: PropTypes.array.isRequired,
    leftSquad: PropTypes.object.isRequired,
    reload: PropTypes.func.isRequired,
    size: PropTypes.string.isRequired,
    view: PropTypes.string.isRequired,
  };

  const { toggleCollapse } = useContext( AccordionContext );

  const toggle = e => toggleCollapse( e.currentTarget.id );
  const hardCounters = !_.isEmpty( counters ) ? counters.filter( x => x.isHardCounter ) : [];
  const softCounters = !_.isEmpty( counters ) ? counters.filter( x => !x.isHardCounter ) : [];

  const divider = hardCounters.length > 0 && softCounters.length > 0 && <Divider/>;

  const buildCounters = ( squads, type ) => squads
    .map( squad => <Suspense key={`${ view }_${ size }_${ squad.id }_row`} fallback={null}>
      <CounterRowSquad
        squad={squad}
        toggle={toggle}
        type={type}
        view={view}
      />
    </Suspense> );

  const buildCounterDescriptions = counters.map( rightSquadStub => (
    <LazyLoad once key={`CounterRowDescription_${ view }_${ size }_${ rightSquadStub.id }`}>
      <CounterRowDescription
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
      <div className="h-100">
        <RightDiv className="pt-0">
          <MiniSquadView
            leftSquadStub={leftSquad}
            size={size}
            toggle={toggle}
          />
          <RightDivWrapper>
            {hardCounters ? buildCounters( hardCounters, 'hard' ) : []}
            {divider}
            {softCounters ? buildCounters( softCounters, 'soft' ) : []}
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
