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

  buildTeam = (team) => {
    let teamToReturn = [];
    if (team) {
      const { characters } = this.state;
      const newTeam = { ...team };
      characters.map((character) => {
        const characterImg = `https://swgoh.gg${character.image}`;
        if (character.name === team.leaderName) {
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
      teamToReturn = newTeam;
    }
    return teamToReturn;
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
    const buildCounterRows = counters.map((counter) => {
      const tempOpponentTeam = teams.filter(x => x.id === counter.opponentTeam);
      const opponentTeam = this.buildTeam(tempOpponentTeam[0]);
      const counterTeams = [];
      teams.map((team) => {
        if (team.id === counter.counterTeam) {
          const syncedTeam = this.buildTeam(team);
          counterTeams.push(syncedTeam);
        }
        return '';
      });
      return <CounterRow
        counterTeams={counterTeams}
        key={counter.counterId}
        opponentTeam={opponentTeam}
      />;
    });

    return (
      <div className="Counters5v5">
        <div className="columnTitles">
          <h1 className="col-2">Team</h1>
          <h1 className="col-5">Hard Counter</h1>
          <h1 className="col-5">Soft Counter</h1>
        </div>
        <div className="columnTeams">
          {buildCounterRows}
        </div>
      </div>
    );
  }
}

export default Counters5v5;
