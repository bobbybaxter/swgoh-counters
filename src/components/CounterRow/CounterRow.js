import React from 'react';
import { UncontrolledCollapse } from 'reactstrap';

import './CounterRow.scss';

class CounterRow extends React.Component {
  buildDescriptions = () => {
    const { counterTeams, teamWithCharData } = this.props;
    const matchupDetails = counterTeams
      .map((counterTeam) => {
        const togglerId = `${counterTeam.counterId}`;
        return (
          <div className="countersDetails my-2" key={counterTeam.counterId}>
            <UncontrolledCollapse toggler={togglerId}>
              <div className="d-flex flex-row">
                <div className="detailsDivLeft col-6 border-dark border-right">
                  <h6>Opponent Team</h6>
                  <h5>{teamWithCharData.name}</h5>
                  <div className="detailsToonRow mb-2">
                    <img alt={teamWithCharData.leaderName} className="toonImg opponentImg" src={teamWithCharData.leaderImage} />
                    {(teamWithCharData.toon2Name) ? (<img alt={teamWithCharData.toon2Name} className="toonImg opponentImg" src={teamWithCharData.toon2Image} />) : ''}
                    {(teamWithCharData.toon3Name) ? (<img alt={teamWithCharData.toon3Name} className="toonImg opponentImg" src={teamWithCharData.toon3Image} />) : ''}
                    {(teamWithCharData.toon4Name) ? (<img alt={teamWithCharData.toon4Name} className="toonImg opponentImg" src={teamWithCharData.toon4Image} />) : ''}
                    {(teamWithCharData.toon5Name) ? (<img alt={teamWithCharData.toon5Name} className="toonImg opponentImg" src={teamWithCharData.toon5Image} />) : ''}
                  </div>
                  <p><i><strong>Subs: </strong>{teamWithCharData.subs}</i></p>
                  <p><strong>Details: </strong>{teamWithCharData.description}</p>
                </div>
                <div className="detailsDivRight col-6">
                  <h6>Counter Team</h6>
                  <h5>{counterTeam.counterTeamName}</h5>
                  <div className="detailsToonRow mb-2">
                    <img alt={counterTeam.oppLeaderName} className="toonImg opponentImg" src={counterTeam.oppLeaderImage} />
                    {(counterTeam.oppToon2Name) ? (<img alt={counterTeam.oppToon2Name} className="toonImg opponentImg" src={counterTeam.oppToon2Image} />) : ''}
                    {(counterTeam.oppToon3Name) ? (<img alt={counterTeam.oppToon3Name} className="toonImg opponentImg" src={counterTeam.oppToon3Image} />) : ''}
                    {(counterTeam.oppToon4Name) ? (<img alt={counterTeam.oppToon4Name} className="toonImg opponentImg" src={counterTeam.oppToon4Image} />) : ''}
                    {(counterTeam.oppToon5Name) ? (<img alt={counterTeam.oppToon5Name} className="toonImg opponentImg" src={counterTeam.oppToon5Image} />) : ''}
                  </div>
                  <p><i><strong>Subs: </strong>{teamWithCharData.subs}</i></p>
                  <p><strong>Counter Strategy: </strong>{teamWithCharData.counterStrategy}</p>
                </div>
              </div>
            </UncontrolledCollapse>
          </div>
        );
      });
    return matchupDetails;
  };

  buildHardCounters = () => {
    const { counterTeams } = this.props;
    const teams = counterTeams
      .filter(x => x.isHardCounter === true)
      .map(counterTeam => (
      // Hard Counter Div
      <div key={counterTeam.counterId} className="countersRow counterCard">
        <img
          id={counterTeam.counterId}
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
          id={counterTeam.counterId}
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
        <div className="d-flex flex-row">
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
        </div>
        <div>
          {this.buildDescriptions()}
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
