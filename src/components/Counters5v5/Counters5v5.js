/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable max-len */
import React from 'react';

import CounterRow from '../CounterRow/CounterRow';

import teamsData from '../../helpers/data/teamsData';
import countersData from '../../helpers/data/countersData';
import characterData from '../../helpers/data/characters.json';

import './Counters5v5.scss';

class Counters5v5 extends React.Component {
  state = {
    characters: [],
    counters: [],
    teams: [],
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
          newMatchup.oppToon4Name = team.toon4Name;
          newMatchup.oppToon5Name = team.toon5Name;
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
      const characterImg = require(`${character.image}`);
      if (character.name === team.oppLeaderName) {
        newTeam.oppLeaderId = character.base_id;
        newTeam.oppLeaderImage = characterImg;
      } else if (character.name === team.oppToon2Name) {
        newTeam.oppToon2Id = character.base_id;
        newTeam.oppToon2Image = characterImg;
      } else if (character.name === team.oppToon3Name) {
        newTeam.oppToon3Id = character.base_id;
        newTeam.oppToon3Image = characterImg;
      } else if (character.name === team.oppToon4Name) {
        newTeam.oppToon4Id = character.base_id;
        newTeam.oppToon4Image = characterImg;
      } else if (character.name === team.oppToon5Name) {
        newTeam.oppToon5Id = character.base_id;
        newTeam.oppToon5Image = characterImg;
      } else if (character.name === team.leaderName) {
        newTeam.leaderId = character.base_id;
        newTeam.leaderImage = characterImg;
      } else if (character.name === team.toon2Name) {
        newTeam.toon2Id = character.base_id;
        newTeam.toon2Image = characterImg;
      } else if (character.name === team.toon3Name) {
        newTeam.toon3Id = character.base_id;
        newTeam.toon3Image = characterImg;
      } else if (character.name === team.toon4Name) {
        newTeam.toon4Id = character.base_id;
        newTeam.toon4Image = characterImg;
      } else if (character.name === team.toon5Name) {
        newTeam.toon5Id = character.base_id;
        newTeam.toon5Image = characterImg;
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

  render() {
    const { counters, teams } = this.state;
    const buildCounterRows = teams.map((team) => {
      const counterMatchups = counters.filter(x => x.opponentTeam === team.id);
      if (counterMatchups.length > 0) {
        const counterTeams = [];
        counterMatchups.map((matchup) => {
          const matchupWithData = this.buildMatchup(matchup);
          return counterTeams.push(matchupWithData);
        });
        const teamWithCharData = this.buildTeam(team);
        return <CounterRow
          counterTeams={counterTeams}
          key={team.id}
          teamWithCharData={teamWithCharData}
        />;
      }
      return '';
    });

    return (
      <div className="Counters5v5">
        <div className="columnTitles">
          <h1 className="col-3 mb-0">Team</h1>
          <div className="col-9">
            <h1 className="mb-0">Counters</h1>
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
          <p className="pt-3 pb-0">
            <small className=" pt-3">
              See a mistake or have a suggestion?
              Leave a comment on my <a href="https://docs.google.com/spreadsheets/d/1RVo7ej1PE06FKkwS1q5_slB9YLLQX3EF-dN98MkFmOM/edit?usp=sharing">Google Sheet</a> or submit an issue on <a href="https://github.com/bobbybaxter/swgoh-counters/issues">Github.</a>
            </small>
          </p>
        </footer>
      </div>
    );
  }
}

export default Counters5v5;
