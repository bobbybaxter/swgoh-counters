/* eslint-disable no-param-reassign */
/* eslint-disable import/no-dynamic-require */

const leftList = [
  'leader',
  'toon2',
  'toon3',
  'toon4',
  'toon5',
];

const rightList = [
  'oppLeader',
  'oppToon2',
  'oppToon3',
  'oppToon4',
  'oppToon5',
];

export default function addImageRefs(countersToBuild, allCharacters) {
  const characters = [...allCharacters];
  const counters = countersToBuild;
  if (counters) {
    counters.forEach((counter) => {
      const { leftSideSquad, rightSideSquads } = counter;

      leftList.forEach((prop) => {
        const matchedCharacter = characters.find(char => char.name === leftSideSquad[`${prop}Name`]);
        if (matchedCharacter) {
          const characterImgRoute = matchedCharacter ? matchedCharacter.image.split('/u/').pop().split('/')[0] : null;
          const characterImg = require(`../components/Counters5v5/characterImages/${characterImgRoute}.png`);
          leftSideSquad[`${prop}Id`] = matchedCharacter.base_id || null;
          leftSideSquad[`${prop}Image`] = characterImg || null;
        }
      });

      rightSideSquads.forEach((rsSquad) => {
        rightList.forEach((prop) => {
          const matchedCharacter = characters.find(char => char.name === rsSquad[`${prop}Name`]);
          if (matchedCharacter) {
            const characterImgRoute = matchedCharacter.image.split('/u/').pop().split('/')[0];
            const characterImg = require(`../components/Counters5v5/characterImages/${characterImgRoute}.png`);
            rsSquad[`${prop}Id`] = matchedCharacter.base_id || null;
            rsSquad[`${prop}Image`] = characterImg || null;
          }
        });
      });
    });
  }
  return counters;
}
