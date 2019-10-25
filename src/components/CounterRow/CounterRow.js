/* eslint-disable max-len */
import React from 'react';
import { Collapse } from 'reactstrap';

import './CounterRow.scss';

class CounterRow extends React.Component {
  buildDescriptions = () => {
    const submissionForm = 'https://docs.google.com/forms/d/e/1FAIpQLSetDRLSGQHCNcw1iCKhNbmouBiOg1dseSBERJNGR5OORFx-lQ/viewform?embedded=true';
    const discordLink = 'https://discord.gg/eCnE48h';
    const { collapse, counterTeams, teamWithCharData } = this.props;
    const matchupDetails = counterTeams
      .map(counterTeam => (
          <div className="countersDetails my-2" key={counterTeam.counterId}>
            <Collapse isOpen={counterTeam.counterId === collapse}>
              <div className="d-flex flex-row">
                <div className="detailsDivLeft col-6 border-dark border-right">
                  <h6 className="text-secondary">Opponent Team</h6>
                  <h5>{teamWithCharData.name}</h5>
                  <div className="detailsToonRow mb-2">
                    <img alt={teamWithCharData.leaderName} className="toonImg opponentImg" title={teamWithCharData.leaderName} src={teamWithCharData.leaderImage} />
                    {(teamWithCharData.toon2Name) ? (<img alt={teamWithCharData.toon2Name} className="toonImg opponentImg" title={teamWithCharData.toon2Name} src={teamWithCharData.toon2Image} />) : ''}
                    {(teamWithCharData.toon3Name) ? (<img alt={teamWithCharData.toon3Name} className="toonImg opponentImg" title={teamWithCharData.toon3Name} src={teamWithCharData.toon3Image} />) : ''}
                    {(teamWithCharData.toon4Name) ? (<img alt={teamWithCharData.toon4Name} className="toonImg opponentImg" title={teamWithCharData.toon4Name} src={teamWithCharData.toon4Image} />) : ''}
                    {(teamWithCharData.toon5Name) ? (<img alt={teamWithCharData.toon5Name} className="toonImg opponentImg" title={teamWithCharData.toon5Name} src={teamWithCharData.toon5Image} />) : ''}
                  </div>
                  {(teamWithCharData.subs) ? (<p><small><strong className="text-secondary">Subs: </strong>{teamWithCharData.subs}</small></p>) : ''}
                  {(teamWithCharData.description) ? (<p><strong className="text-secondary">Details: </strong>{teamWithCharData.description}</p>) : ''}
                  {(teamWithCharData.counterStrategy) ? (<p><strong className="text-secondary">General Strategy: </strong>{teamWithCharData.counterStrategy}</p>) : (<p className="text-secondary"><small>You can help me add common substitutions, a general counter strategy, or details about this team by <a href={submissionForm}>submiting an issue.</a></small></p>)}
                  {(teamWithCharData.counterStrategy) ? '' : (<p className="text-secondary"><small>You can also join me on <a href={discordLink}>Discord</a> to discuss counters a little further.</small></p>)}
                </div>
                <div className="detailsDivRight col-6">
                  <h6 className="text-secondary">Counter Team</h6>
                  <h5>{counterTeam.counterTeamName}</h5>
                  <div className="detailsToonRow mb-2">
                    <img alt={counterTeam.oppLeaderName} className="toonImg opponentImg" title={teamWithCharData.oppLeaderName} src={counterTeam.oppLeaderImage} />
                    {(counterTeam.oppToon2Name) ? (<img alt={counterTeam.oppToon2Name} className="toonImg opponentImg" title={counterTeam.toon2Name} src={counterTeam.oppToon2Image} />) : ''}
                    {(counterTeam.oppToon3Name) ? (<img alt={counterTeam.oppToon3Name} className="toonImg opponentImg" title={counterTeam.toon3Name} src={counterTeam.oppToon3Image} />) : ''}
                    {(counterTeam.oppToon4Name) ? (<img alt={counterTeam.oppToon4Name} className="toonImg opponentImg" title={counterTeam.toon4Name} src={counterTeam.oppToon4Image} />) : ''}
                    {(counterTeam.oppToon5Name) ? (<img alt={counterTeam.oppToon5Name} className="toonImg opponentImg" title={counterTeam.toon5Name} src={counterTeam.oppToon5Image} />) : ''}
                  </div>
                  {(counterTeam.subs) ? (<p><small><strong className="text-secondary">Subs: </strong>{counterTeam.subs}</small></p>) : ''}
                  {(counterTeam.description) ? (<p><strong className="text-secondary">Strategy: </strong>{counterTeam.description}</p>) : (<p className="text-secondary"><small>Do you know the strategy to beat the {teamWithCharData.name} team with {counterTeam.counterTeamName}?  If so, please <a href={submissionForm}>submit an issue.</a></small></p>)}
                  {(counterTeam.description) ? '' : (<p className="text-secondary"><small>You can also join me on <a href={discordLink}>Discord</a> to start a discussion regarding this team.</small></p>)}
                </div>
              </div>
            </Collapse>
          </div>
      ));
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
          onClick={this.toggle}
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
          onClick={this.toggle}
          src={counterTeam.oppLeaderImage}
          title={counterTeam.counterTeamName}
          alt={counterTeam.counterTeamName}
        />
      </div>
      ));
    return exp;
  }

  toggle = (e) => {
    this.props.toggleCollapse(e.target.id);
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
            <div className="insideCountersRow">
              {this.buildHardCounters()}
              <div className={hardCounters.length > 0 && softCounters.length > 0 ? 'borderSpace border-dark border-right' : ''}></div>
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
