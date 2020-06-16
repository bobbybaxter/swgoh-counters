import React from 'react';

import BuildDescriptions from '../BuildDescriptions/BuildDescriptions';
import BuildHardCounters from '../BuildHardCounters/BuildHardCounters';
import BuildSoftCounters from '../BuildSoftCounters/BuildSoftCounters';

import './CounterRow.scss';

// TODO: Add proptypes
// TODO: Add tests
export default function CounterRow(props) {
  const {
    collapse,
    counterTeams,
    squadWithCharData: opponentTeam,
    toggleCollapse,
    view,
  } = props;

  const toggle = (e) => { toggleCollapse(e.target.id); };
  const hardCounters = counterTeams.filter(x => x.isHardCounter === true);
  const softCounters = counterTeams.filter(x => x.isHardCounter === false);
  const divider = <div className={hardCounters.length > 0 && softCounters.length > 0
    ? 'borderSpace border-dark border-right'
    : ''}></div>;
  const renderedRow = <div className="CounterRow">
        <div className="d-flex flex-row">

          {/* Left Side Team Div */}
          <div className="countersRow col-3 justify-content-center border-dark border-bottom">
            <div className="opponentCard">
              <img
                className="toonImg grayImg"
                src={opponentTeam.leaderImage}
                title={opponentTeam.name}
                alt={opponentTeam.name}
              />
              <h6 className="teamName">{opponentTeam.name}</h6>
            </div>
          </div>

          {/* Right Side Counter Div */}
          <div className="countersRow col-9 border-dark border-bottom border-left">
            <div className="insideCountersRow">
              <BuildHardCounters counterTeams={counterTeams} toggle={toggle} />
              {divider}
              <BuildSoftCounters counterTeams={counterTeams} toggle={toggle} />
            </div>
          </div>
        </div>

        {/* Collapsable Description Card */}
        <div>
          <BuildDescriptions
            collapse={collapse}
            counterTeams={counterTeams}
            squadWithCharData={opponentTeam}
            view={view}
          />
        </div>
      </div>;

  return (
      <div>
        {renderedRow || null}
      </div>
  );
}
