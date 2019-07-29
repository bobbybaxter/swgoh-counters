import React from 'react';

import './CounterRow.scss';

class CounterRow extends React.Component {
  buildHardCounters = () => {
    const { counterTeams } = this.props;
    const exp = counterTeams
      .filter(x => x.isHardCounter === true)
      .map(counterTeam => (
      <div key={counterTeam.counterId} className="countersRow counterCard">
        <img
          className="toonImg"
          src={counterTeam.oppLeaderImage}
          title={counterTeam.counterTeamName}
          alt={counterTeam.counterTeamName}
        />
      </div>
      ));
    return exp;
  }

  buildSoftCounters = () => {
    const { counterTeams } = this.props;
    const exp = counterTeams
      .filter(x => x.isHardCounter === false)
      .map(counterTeam => (
      <div key={counterTeam.counterId} className="countersRow counterCard">
        <img
          className="toonImg"
          src={counterTeam.oppLeaderImage}
          title={counterTeam.counterTeamName}
          alt={counterTeam.counterTeamName}
        />
      </div>
      ));
    return exp;
  }

  render() {
    let renderedRow;
    if (this.props.teamWithCharData) {
      const opponentTeam = this.props.teamWithCharData;

      renderedRow = <div className="CounterRow">
        <div className="countersRow col-2 justify-content-center border-dark border-bottom">
          <div className="opponentCard">
            <img
              className="toonImg"
              src={opponentTeam.leaderImage}
              title={opponentTeam.name}
              alt={opponentTeam.name}
            />
          </div>
        </div>
        <div className="countersRow col-5 border-dark border-bottom border-left border-right">
          {this.buildHardCounters()}
        </div>
        <div className="countersRow col-5 border-dark border-bottom">
          {this.buildSoftCounters()}
        </div>
      </div>;
    } else {
      renderedRow = null;
    }

    return (
      <div>
        {renderedRow}
      </div>
    );
  }
}

export default CounterRow;
