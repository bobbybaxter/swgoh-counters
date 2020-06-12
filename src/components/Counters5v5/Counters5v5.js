/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import {
  Button,
} from 'reactstrap';

import CounterRow from '../CounterRow/CounterRow';

import getSquadData from '../../helpers/data/squadsData';
import getCounterData from '../../helpers/data/countersData';
import characterData from '../../helpers/data/characters.json';
import buildOpponentTeam from '../../helpers/buildOpponentTeam';
import buildSquad from '../../helpers/buildSquad';

import './Counters5v5.scss';

const Counters5v5 = () => {
  const [characters, setCharacters] = useState([]);
  const [counters, setCounters] = useState([]);
  const [squads, setSquads] = useState([]);
  const [collapse, setCollapse] = useState([]);
  const [view, setView] = useState('normal');

  useEffect(() => {
    if (characterData) {
      setCharacters(characterData.data);
      getSquads();
      getCounters();
    }
  }, []);

  const getCounters = () => {
    getCounterData()
      .then(res => setCounters(res))
      .catch(err => console.error(err));
  };

  const getSquads = () => {
    getSquadData()
      .then(res => setSquads(res))
      .catch(err => console.error(err));
  };

  const toggleCollapse = input => (setCollapse(collapse === input ? null : input));

  const buildCounterRows = squads.map((squad) => {
    const counterMatchups = () => {
      if (view === 'normal') {
        return counters
          .filter(x => x.battleType === '5v5')
          .filter(x => x.opponentTeam === squad.id);
      } if (view === 'reverse') {
        return counters
          .filter(x => x.battleType === '5v5')
          .filter(x => x.counterTeam === squad.id);
      }
      return '';
    };
    if (counterMatchups().length) {
      // adds ids and images
      const leftSideSquad = buildSquad(squad, 5, characters);
      // adds finds characters from counterMatchups and builds objects for them to be displayed
      const rightSideSquads = counterMatchups().map(matchup => buildOpponentTeam(matchup, 5, squads, characters, view));
      return <CounterRow
              collapse={collapse}
              counterTeams={rightSideSquads}
              key={squad.id}
              squadWithCharData={leftSideSquad}
              toggleCollapse={toggleCollapse}
              view={view}
            />;
    }
    return '';
  });

  const handleReverseCounter = () => {
    setView(view === 'normal' ? 'reverse' : 'normal');
  };

  return (
      <div className="Counters5v5">
        <div className="contentWrapper">
          <div className="py-3">
            <a href="https://patreon.com/saiastrange" className="btn patreonBtn">SUPPORT US ON PATREON!</a>
          </div>
          <div className="columnTitles">
            <h1 className="col-3 mb-0">{view === 'normal' ? 'Opponent' : 'Counter'}</h1>
            <div className="col-8">
              <h1 className="mb-0">{view === 'normal' ? '5v5 Counters' : '5v5 Opponents'}</h1>
              <small className="m-0 p-0 text-secondary">
                {
                  view === 'normal'
                    ? 'Click on a counter team to see more info.'
                    : 'Click on an opponent team to see more info.'
                }
              </small>
            </div>
            <Button className="btn-sm col-1 reverseCounterButton" onClick={handleReverseCounter}>
              {view === 'normal' ? 'Normal View' : 'Reverse View'}
            </Button>
          </div>
          <div className="columnTeams">
            {buildCounterRows || ''}
          </div>
          <footer className="mt-3">
          <div className="d-flex flex-row justify-content-center align-items-center">
          <span className="hardCounterColorBox"></span>
            <h6 className="mb-0 mr-4">Hard Counter</h6>
          <span className="softCounterColorBox"></span>
            <h6 className="mb-0">Soft Counter</h6>
          </div>
          <div className="py-3">
            <strong>Note:</strong> Darth Revan (with or without Malak) is a hard counter unless it is listed as a soft counter<br/>
          </div>
          <div className="offset-2 col-8 border-dark border-top"></div>
          <div className="py-3">
            <a href="https://patreon.com/saiastrange" className="btn patreonBtn">SUPPORT US ON PATREON!</a>
          </div>
        </footer>
        </div>
      </div>
  );
};

export default Counters5v5;
