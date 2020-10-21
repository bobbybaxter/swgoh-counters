/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import getImage from '../../helpers/getImage';

import CounterRowDescription from '../CounterRowDescription/CounterRowDescription';
import CounterRowSquad from '../CounterRowSquad/CounterRowSquad';

import './CounterRow.scss';
import { getCounterStubsBySquadId } from '../../helpers/data/countersData';

// TODO: Add tests
export default function CounterRow(props) {
  CounterRow.propTypes = {
    collapse: PropTypes.string,
    leftSquadStub: PropTypes.object.isRequired,
    toggleCollapse: PropTypes.func.isRequired,
    view: PropTypes.string.isRequired,
  };

  const {
    collapse, leftSquadStub, toggleCollapse, view,
  } = props;

  const storedStubs = JSON.parse(sessionStorage.getItem(`${view}_${leftSquadStub.id}`));
  const [counterStubs, setCounterStubs] = useState(storedStubs);

  const toggle = (e) => { toggleCollapse(e.target.id); };

  useEffect(() => {
    // abortController cleans up cancelled requests
    const abortController = new AbortController();
    const opts = { signal: abortController.signal };

    // TODO: get indexedDB to work
    async function getCounterStubs() {
      try {
        console.log('still requested');
        const stubs = await getCounterStubsBySquadId(leftSquadStub.id, view, '5v5', opts);
        setCounterStubs(stubs);
        sessionStorage.setItem(`${view}_${leftSquadStub.id}`, JSON.stringify(stubs));
      } catch (e) {
        abortController.abort();
        if (!abortController.signal.aborted) {
          console.log('e :>> ', e);
        }
      }
    }

    if (!counterStubs) {
      getCounterStubs();
    }

    return () => {
      abortController.abort();
    };
  }, [counterStubs, leftSquadStub.id, view]);

  const hardCounters = counterStubs ? counterStubs.rightSquadStubs.filter(x => x.isHardCounter === 1) : [];
  const softCounters = counterStubs ? counterStubs.rightSquadStubs.filter(x => x.isHardCounter === 0) : [];
  const divider = <div className={hardCounters.length > 0 && softCounters.length > 0
    ? 'borderSpace border-dark border-right'
    : ''}></div>;

  const buildCounters = (squads, type) => squads
    .map(squad => <CounterRowSquad
        key={`${view}_5v5_${squad.counterId}_row`}
        squad={squad}
        toggle={toggle}
        type={type}
      />);

  const buildCounterDescriptions = counterStubs
    ? counterStubs.rightSquadStubs.map(rightSquadStub => (
        <CounterRowDescription
          collapse={collapse}
          key={`${view}_5v5_${rightSquadStub.counterId}_description`}
          rightSquadStub={rightSquadStub}
          view={view}
        />
    ))
    : null;

  // TODO: make button to add counters, possibly add a circle with a plus sign after the last soft counter
  const renderedRow = <div className="CounterRow">
        <div className="d-flex flex-row">

          {/* Left Side Team Div */}
          <div className="countersRow col-3 justify-content-center border-dark border-bottom">
            <div className="opponentCard">
              <img
                className="toonImg grayImg"
                src={ getImage(leftSquadStub.toon1Id) }
                title={leftSquadStub.name}
                alt={leftSquadStub.name}
              />
              <h6 className="teamName">{leftSquadStub.name}</h6>
            </div>
          </div>

          {/* Right Side Counter Div */}
          <div className="countersRow col-9 border-dark border-bottom border-left">
            <div className="insideCountersRow">
              {hardCounters ? buildCounters(hardCounters, 'hard') : []}
              {divider}
              {softCounters ? buildCounters(softCounters, 'soft') : []}
            </div>
          </div>
        </div>

        {/* Collapsable Description Card */}
        <div>
          {buildCounterDescriptions}
        </div>
      </div>;

  return (
      <div>
        {renderedRow || null}
      </div>
  );
}
