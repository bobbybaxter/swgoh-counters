/* eslint-disable max-len */
import React from 'react';

import CounterRow from '../CounterRow/CounterRow';

import teamsData from '../../helpers/data/teamsData';
import countersData from '../../helpers/data/countersData';
import characterData from '../../helpers/data/characterData';

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
      const characterImg = `https://swgoh.gg${character.image}`;
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

  getCharacters = () => {
    characterData.getAllCharacters()
      .then(res => this.setState({ characters: res }))
      .catch(err => console.error(err));
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
    this.getCharacters();
    this.getTeams();
    this.getCounters();
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
          <h1 className="col-3">Team</h1>
          <h1 className="col-9">Counters</h1>
        </div>
        <div className="columnTeams">
          {buildCounterRows}
        </div>
        <footer className="my-3">
          <div className="d-flex flex-row justify-content-center align-items-center">
          <span className="hardCounterColorBox"></span>
            <p className="mb-0 mr-4">Hard Counter</p>
          <span className="softCounterColorBox"></span>
            <p className="mb-0">Soft Counter</p>
          </div>
          <div className="mt-3">
            <strong>Note:</strong> Darth Revan (with or without Malak) is a hard counter unless it is listed as a soft counter<br/>
          </div>
        </footer>
      </div>
    );
  }
}

export default Counters5v5;
