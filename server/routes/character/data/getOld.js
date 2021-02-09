const axios = require('axios');

module.exports = ({ log }) => async () => {
  const fullCharacters = await axios.get('https://swgoh.gg/api/characters/');
  const allAbilities = await axios.get('https://swgoh.gg/api/abilities/');

  const zetas = allAbilities.data
    .filter(abil => abil.is_zeta === true)
    .map(abil => ({
      name: abil.name,
      characterId: abil.character_base_id,
    }));

  const characters = fullCharacters.data.map(char => ({
    id: char.base_id,
    name: char.name,
    zetas: zetas
      .filter(zeta => zeta.characterId === char.base_id)
      .map(zeta => zeta.name),
  }));

  characters && log.info('Character data received.');
  return characters;
};
