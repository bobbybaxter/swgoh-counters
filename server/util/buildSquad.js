/* eslint-disable import/no-dynamic-require */
module.exports = function buildTeam(teamToBuild, teamSize, allCharacters) {
  const characters = [...allCharacters];
  const team = { ...teamToBuild };
  if (teamSize === 5) {
    characters.map((character) => {
      switch (character.name) {
        case team.leaderName:
          team.leaderId = character.base_id;
          break;
        case team.toon2Name:
          team.toon2Id = character.base_id;
          break;
        case team.toon3Name:
          team.toon3Id = character.base_id;
          break;
        case team.toon4Name:
          team.toon4Id = character.base_id;
          break;
        case team.toon5Name:
          team.toon5Id = character.base_id;
          break;
        case team.oppLeaderName:
          team.oppLeaderId = character.base_id;
          break;
        case team.oppToon2Name:
          team.oppToon2Id = character.base_id;
          break;
        case team.oppToon3Name:
          team.oppToon3Id = character.base_id;
          break;
        case team.oppToon4Name:
          team.oppToon4Id = character.base_id;
          break;
        case team.oppToon5Name:
          team.oppToon5Id = character.base_id;
          break;
        default: return '';
      }
      return '';
    });
  }

  if (teamSize === 3) {
    characters.map((character) => {
      switch (character.name) {
        case team.leaderName:
          team.leaderId = character.base_id;
          break;
        case team.toon2Name:
          team.toon2Id = character.base_id;
          break;
        case team.toon3Name:
          team.toon3Id = character.base_id;
          break;
        case team.oppLeaderName:
          team.oppLeaderId = character.base_id;
          break;
        case team.oppToon2Name:
          team.oppToon2Id = character.base_id;
          break;
        case team.oppToon3Name:
          team.oppToon3Id = character.base_id;
          break;
        default: return '';
      }
      return '';
    });
  }

  return team;
};
