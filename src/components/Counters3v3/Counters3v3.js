/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';

import CounterRow from '../CounterRow/CounterRow';

import teamsData from '../../helpers/data/teamsData';
import countersData from '../../helpers/data/countersData';
import characterData from '../../helpers/data/characters.json';
import buildMatchup from '../../helpers/buildMatchup';
import buildTeam from '../../helpers/buildTeam';

import './Counters3v3.scss';

const Counters3v3 = () => {
  const [characters, setCharacters] = useState([]);
  const [counters, setCounters] = useState([]);
  const [teams, setTeams] = useState([]);
  const [collapse, setCollapse] = useState([]);

  useEffect(() => {
    if (characterData) {
      setCharacters(characterData.data);
      getTeams();
      getCounters();
    }
  }, []);

  const getCounters = () => {
    countersData.getCounters()
      .then(res => setCounters(res))
      .catch(err => console.error(err));
  };

  const getTeams = () => {
    teamsData.getTeams()
      .then(res => setTeams(res))
      .catch(err => console.error(err));
  };

  const toggleCollapse = input => (setCollapse(collapse === input ? null : input));

  const buildCounterRows = teams.map((team) => {
    const counterMatchups = counters
      .filter(x => x.battleType === '3v3')
      .filter(x => x.opponentTeam === team.id);
    if (counterMatchups.length > 0) {
      const teamWithCharData = buildTeam(team, 3, characters);
      const counterTeams = counterMatchups.map(matchup => buildMatchup(matchup, 3, teams, characters));
      return <CounterRow
              collapse={collapse}
              counterTeams={counterTeams}
              key={team.id}
              teamWithCharData={teamWithCharData}
              toggleCollapse={toggleCollapse}
            />;
    }
    return '';
  });

  return (
      <div className="Counters3v3">
          <div className="py-3">
            <a href="https://patreon.com/saiastrange" className="btn patreonBtn">SUPPORT US ON PATREON!</a>
          </div>
        <div className="columnTitles">
          <h1 className="col-3 mb-0">Team</h1>
          <div className="col-9">
            <h1 className="mb-0">3v3 Counters</h1>
            <small className="m-0 p-0 text-secondary">Click on a counter team to see more info.</small>
          </div>
        </div>
        <div className="columnTeams">
          {buildCounterRows}
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
  );
};

export default Counters3v3;
