import React from 'react';

export default function buildSoftCounters(props) {
  const { counterTeams, toggle } = props;
  const exp = counterTeams
    .filter(x => x.isHardCounter === false)
    .map(counterTeam => (
    // Soft Counter Div
    <div key={counterTeam.counterId} className="countersRow counterCard">
      <img
        id={counterTeam.counterId}
        className="toonImg softCounter"
        onClick={toggle}
        src={counterTeam.oppLeaderImage}
        title={counterTeam.counterTeamName}
        alt={counterTeam.counterTeamName}
      />
    </div>
    ));
  return exp;
}
