/* eslint-disable import/no-dynamic-require */
export default function buildTeam(teamToBuild, teamSize, allCharacters) {
  const characters = [...allCharacters];
  const team = { ...teamToBuild };
  if (teamSize === 5) {
    characters.map((character) => {
      const characterImgRoute = character.image.split('/u/').pop().split('/')[0];
      const characterImg = require(`../components/Counters5v5/characterImages/${characterImgRoute}.png`);
      if (character.name === team.oppLeaderName) {
        team.oppLeaderId = character.base_id;
        team.oppLeaderImage = characterImg;
      } else if (character.name === team.oppToon2Name) {
        team.oppToon2Id = character.base_id;
        team.oppToon2Image = characterImg;
      } else if (character.name === team.oppToon3Name) {
        team.oppToon3Id = character.base_id;
        team.oppToon3Image = characterImg;
      } else if (character.name === team.oppToon4Name) {
        team.oppToon4Id = character.base_id;
        team.oppToon4Image = characterImg;
      } else if (character.name === team.oppToon5Name) {
        team.oppToon5Id = character.base_id;
        team.oppToon5Image = characterImg;
      } else if (character.name === team.leaderName) {
        team.leaderId = character.base_id;
        team.leaderImage = characterImg;
      } else if (character.name === team.toon2Name) {
        team.toon2Id = character.base_id;
        team.toon2Image = characterImg;
      } else if (character.name === team.toon3Name) {
        team.toon3Id = character.base_id;
        team.toon3Image = characterImg;
      } else if (character.name === team.toon4Name) {
        team.toon4Id = character.base_id;
        team.toon4Image = characterImg;
      } else if (character.name === team.toon5Name) {
        team.toon5Id = character.base_id;
        team.toon5Image = characterImg;
      }
      return '';
    });
  }

  if (teamSize === 3) {
    characters.map((character) => {
      const characterImgRoute = character.image.split('/u/').pop().split('/')[0];
      const characterImg = require(`../components/Counters5v5/characterImages/${characterImgRoute}.png`);
      if (character.name === team.oppLeaderName) {
        team.oppLeaderId = character.base_id;
        team.oppLeaderImage = characterImg;
      } else if (character.name === team.oppToon2Name) {
        team.oppToon2Id = character.base_id;
        team.oppToon2Image = characterImg;
      } else if (character.name === team.oppToon3Name) {
        team.oppToon3Id = character.base_id;
        team.oppToon3Image = characterImg;
      } else if (character.name === team.leaderName) {
        team.leaderId = character.base_id;
        team.leaderImage = characterImg;
      } else if (character.name === team.toon2Name) {
        team.toon2Id = character.base_id;
        team.toon2Image = characterImg;
      } else if (character.name === team.toon3Name) {
        team.toon3Id = character.base_id;
        team.toon3Image = characterImg;
      }
      return '';
    });
  }

  return team;
}
