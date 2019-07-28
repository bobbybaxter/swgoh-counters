import React from 'react';

import './CounterRow.scss';

class CounterRow extends React.Component {
  buildHardCounters = () => {
    const { counterTeams } = this.props;
    const exp = counterTeams.map(counterTeam => (
      <div key={counterTeam.leaderName}>
          <img
          className="toonImg"
          src={counterTeam.leaderImage}
          title={counterTeam.leaderName}
          alt={counterTeam.leaderName}
        />
      </div>
    ));
    return exp;
  }

  render() {
    let renderedRow;
    if (this.props.opponentTeam) {
      const { opponentTeam } = this.props;

      renderedRow = <div className="CounterRow">
        <div className="col-2">
          <img
            className="toonImg"
            src={opponentTeam.leaderImage}
            title={opponentTeam.leaderName}
            alt={opponentTeam.leadername}
          />
        </div>
        <div className="col-5">
          {this.buildHardCounters()}
        </div>
        <p className="col-5">Soft Counter</p>
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
