/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import getImage from '../../helpers/getImage';
import { IDBService } from '../../setup/IndexedDB';

import CounterRowDescription from '../CounterRowDescription/CounterRowDescription';
import CounterRowSquad from '../CounterRowSquad/CounterRowSquad';

import './CounterRow.scss';
import { getCounterStubsBySquadId } from '../../helpers/data/countersData';

// TODO: Add tests
export default function CounterRow(props) {
  CounterRow.propTypes = {
    collapse: PropTypes.string,
    leftSquadStub: PropTypes.object.isRequired,
    size: PropTypes.string.isRequired,
    toggleCollapse: PropTypes.func.isRequired,
    view: PropTypes.string.isRequired,
  };

  const {
    collapse, leftSquadStub, size, toggleCollapse, view,
  } = props;

  const [counterStubs, setCounterStubs] = useState();

  const toggle = (e) => { toggleCollapse(e.target.id); };

  useEffect(() => {
    // abortController cleans up cancelled requests
    const abortController = new AbortController();
    const opts = { signal: abortController.signal };
    const counterStubId = `${size}_${view}_${leftSquadStub.id}`;

    async function getCounterStubs() {
      const storedStubs = await IDBService.get('counterStubs', counterStubId);

      if (storedStubs) {
        setCounterStubs(storedStubs);
      } else {
        try {
          const stubs = await getCounterStubsBySquadId(leftSquadStub.id, view, size, opts);
          setCounterStubs(stubs);
          const objectToStore = {
            id: counterStubId,
            counterVersion: stubs.counterVersion,
            rightSquadStubs: stubs.rightSquadStubs,
          };
          IDBService.put('counterStubs', objectToStore);
        } catch (e) {
          abortController.abort();
          if (!abortController.signal.aborted) {
            console.log('e :>> ', e);
          }
        }
      }
    }

    getCounterStubs();
    return () => {
      abortController.abort();
    };
  }, [leftSquadStub.id, size, view]);

  const hardCounters = counterStubs ? counterStubs.rightSquadStubs.filter(x => x.isHardCounter === 1) : [];
  const softCounters = counterStubs ? counterStubs.rightSquadStubs.filter(x => x.isHardCounter === 0) : [];
  const divider = <div className={hardCounters.length > 0 && softCounters.length > 0
    ? 'borderSpace border-dark border-right'
    : ''}></div>;

  const buildCounters = (squads, type) => squads
    .map(squad => <CounterRowSquad
        key={`${view}_${size}_${squad.counterId}_row`}
        squad={squad}
        toggle={toggle}
        type={type}
      />);

  const buildCounterDescriptions = counterStubs
    ? counterStubs.rightSquadStubs.map(rightSquadStub => (
        <CounterRowDescription
          collapse={collapse}
          key={`${view}_${size}_${rightSquadStub.counterId}_description`}
          rightSquadStub={rightSquadStub}
          size={size}
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
