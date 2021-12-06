export default function mergeCharacterAndPlayerData( allCharacters, playerData ) {
  return allCharacters.map( char => {
    const matchedCharacter = playerData.filter( ownedChar => ownedChar.name === char.name )[ 0 ];
    if ( matchedCharacter ) {
      return matchedCharacter;
    }
    return {
      base_id: char.id,
      name: char.name,
      gear_level: 0,
      level: 0,
      power: 0,
      rarity: 0,
      gear: [],
      url: '',
      stats: {},
      zeta_abilities: [],
      ability_data: [],
      mod_set_ids: [],
      combat_type: 1,
      relic_tier: 0,
      has_ultimate: false,
    };
  } );
}
