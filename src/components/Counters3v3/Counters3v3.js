/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable max-len */
import React from 'react';

import CounterRow from '../CounterRow/CounterRow';

import teamsData from '../../helpers/data/teamsData';
import countersData from '../../helpers/data/countersData';
import characterData from '../../helpers/data/characters.json';

import './Counters3v3.scss';

class Counters3v3 extends React.Component {
  state = {
    characters: [],
    counters: [],
    teams: [],
    collapse: {},
  }

  buildMatchup = (matchup) => {
    let matchupToReturn = [];
    if (matchup) {
      const { teams } = this.state;
      const newMatchup = { ...matchup };
      teams.map((team) => {
        if (team.id === newMatchup.counterTeam) {
          newMatchup.oppLeaderName = team.leaderName;
          newMatchup.oppToon2Name = team.toon2Name;
          newMatchup.oppToon3Name = team.toon3Name;
          newMatchup.counterTeamName = team.name;
          newMatchup.subs = team.subs;
        } else {
          return '';
        }
        return '';
      });
      const newMatchupWithToonInfo = this.buildTeam(newMatchup);
      matchupToReturn = newMatchupWithToonInfo;
    } else {
      return '';
    }
    return matchupToReturn;
  }

  buildTeam = (team) => {
    const { characters } = this.state;
    const newTeam = { ...team };
    characters.map((character) => {
      const characterImgRoute = character.image.split('/u/').pop().split('/')[0];
      // const characterImg = require(`${character.image}`);
      const characterImg = require(`../Counters5v5/characterImages/${characterImgRoute}.png`);
      if (character.name === team.oppLeaderName) {
        newTeam.oppLeaderId = character.base_id;
        newTeam.oppLeaderImage = characterImg;
      } else if (character.name === team.oppToon2Name) {
        newTeam.oppToon2Id = character.base_id;
        newTeam.oppToon2Image = characterImg;
      } else if (character.name === team.oppToon3Name) {
        newTeam.oppToon3Id = character.base_id;
        newTeam.oppToon3Image = characterImg;
      } else if (character.name === team.leaderName) {
        newTeam.leaderId = character.base_id;
        newTeam.leaderImage = characterImg;
      } else if (character.name === team.toon2Name) {
        newTeam.toon2Id = character.base_id;
        newTeam.toon2Image = characterImg;
      } else if (character.name === team.toon3Name) {
        newTeam.toon3Id = character.base_id;
        newTeam.toon3Image = characterImg;
      }
      return '';
    });
    return newTeam;
  }

  getCounters = () => {
    countersData.getCounters()
      .then(res => this.setState({ counters: res }))
      .catch(err => console.error(err));
  }

  getTeams = () => {
    teamsData.getTeams()
      .then(res => this.setState({ teams: res }))
      .catch(err => console.error(err));
  }

  componentDidMount() {
    if (characterData) {
      this.setState({ characters: characterData.data });
      this.getTeams();
      this.getCounters();
    }
  }

  toggleCollapse = input => (this.setState({ collapse: this.state.collapse === input ? null : input }));

  render() {
    const { collapse, counters, teams } = this.state;
    const buildCounterRows = teams.map((team) => {
      const counterMatchups = counters
        .filter(x => x.battleType === '3v3')
        .filter(x => x.opponentTeam === team.id);
      if (counterMatchups.length > 0) {
        const counterTeams = [];
        counterMatchups.map((matchup) => {
          const matchupWithData = this.buildMatchup(matchup);
          return counterTeams.push(matchupWithData);
        });
        const teamWithCharData = this.buildTeam(team);
        return <CounterRow
          collapse={collapse}
          counterTeams={counterTeams}
          key={team.id}
          teamWithCharData={teamWithCharData}
          toggleCollapse={this.toggleCollapse}
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
  }
}

export default Counters3v3;
