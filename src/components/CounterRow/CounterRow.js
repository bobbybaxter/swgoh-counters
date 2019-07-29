import React from 'react';

import './CounterRow.scss';

class CounterRow extends React.Component {
  // buildCounters = () => {
  //   const { counterTeams } = this.props;
  //   const exp = counterTeams.map((counterTeam) => {
  //     if (counterTeam.isHardCounter === true) {
  //       return (
  //         <div key={counterTeam.counterId} className="countersRow counterCard">
  //         <img
  //           className="toonImg hardCounter"
  //           src={counterTeam.oppLeaderImage}
  //           title={counterTeam.counterTeamName}
  //           alt={counterTeam.counterTeamName}
  //         />
  //       </div>
  //       );
  //     }
  //     return (
  //         <div key={counterTeam.counterId} className="countersRow counterCard">
  //         <img
  //           className="toonImg softCounter"
  //           src={counterTeam.oppLeaderImage}
  //           title={counterTeam.counterTeamName}
  //           alt={counterTeam.counterTeamName}
  //         />
  //       </div>
  //     );
  //   });
  //   return exp;
  // }

  // buildBorder = () => {
  //   const { counterTeams } = this.props;
  //   const hardCounters = counterTeams.filter(x => x.isHardCounter === true);
  //   const softCounters = counterTeams.filter(x => x.isHardCounter === false);
  //   let border;
  //   if (hardCounters.length > 0) {
  //     border = <div className="counterMiddleBorder border-dark border-right"></div>;
  //   } else if (softCounters.length > 0) {
  //     border = <div className="counterMiddleBorder border-dark border-left"></div>;
  //   }
  //   return border;
  // }

  buildHardCounters = () => {
    const { counterTeams } = this.props;
    const teams = counterTeams
      .filter(x => x.isHardCounter === true)
      .map(counterTeam => (
      // Hard Counter Div
      <div key={counterTeam.counterId} className="countersRow counterCard">
        <img
          className="toonImg hardCounter"
          src={counterTeam.oppLeaderImage}
          title={counterTeam.counterTeamName}
          alt={counterTeam.counterTeamName}
        />
      </div>
      ));
    return teams;
  }

  buildSoftCounters = () => {
    const { counterTeams } = this.props;
    const exp = counterTeams
      .filter(x => x.isHardCounter === false)
      .map(counterTeam => (
      // Soft Counter Div
      <div key={counterTeam.counterId} className="countersRow counterCard">
        <img
          className="toonImg softCounter"
          src={counterTeam.oppLeaderImage}
          title={counterTeam.counterTeamName}
          alt={counterTeam.counterTeamName}
        />
      </div>
      ));
    return exp;
  }

  render() {
    const { counterTeams } = this.props;
    const hardCounters = counterTeams.filter(x => x.isHardCounter === true);
    const softCounters = counterTeams.filter(x => x.isHardCounter === false);
    let renderedRow;
    if (this.props.teamWithCharData) {
      const opponentTeam = this.props.teamWithCharData;
      renderedRow = <div className="CounterRow">
        {/* Opponent Team Div */}
        <div className="countersRow col-3 justify-content-center border-dark border-bottom">
          <div className="opponentCard">
            <img
              className="toonImg opponentImg"
              src={opponentTeam.leaderImage}
              title={opponentTeam.name}
              alt={opponentTeam.name}
            />
            <h6 className="teamName">{opponentTeam.name}</h6>
          </div>
        </div>
        <div className="countersRow col-9 border-dark border-bottom border-left">
          <div className={hardCounters.length > 0 && softCounters.length > 0 ? 'hardCountersRow borderSpace border-dark border-right' : 'hardCountersRow'}>
            {this.buildHardCounters()}
          </div>
          <div className="softCountersRow border-dark">
            {this.buildSoftCounters()}
          </div>
        </div>
        {/* <div className="countersRow col-5 border-dark border-bottom">
          {this.buildSoftCounters()}
        </div> */}
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
