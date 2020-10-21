import axios from 'axios';

export function getAllCharacters() {
  const characters = new Promise((resolve, reject) => {
    axios.get('https://cors-anywhere.herokuapp.com/https://swgoh.gg/api/characters/')
      .then((res) => {
        const rawCharacters = res.data;
        const newCharacters = rawCharacters.map(char => ({
          id: char.base_id,
          name: char.name,
        }));
        resolve(newCharacters);
      })
      .catch(err => reject(err));
  });

  return characters;
}

export function getCharactersBySquad(
  toon1Name,
  toon2Name,
  toon3Name,
  toon4Name,
  toon5Name,
) {
  const characters = new Promise((resolve, reject) => {
    axios.get('https://cors-anywhere.herokuapp.com/https://swgoh.gg/api/characters/')
      .then((res) => {
        const rawCharacters = res.data;
        const tempSquad = [];
        const newToon1 = rawCharacters.filter(x => x.name === toon1Name)[0];
        const newToon2 = rawCharacters.filter(x => x.name === toon2Name)[0];
        const newToon3 = rawCharacters.filter(x => x.name === toon3Name)[0];
        const newToon4 = rawCharacters.filter(x => x.name === toon4Name)[0];
        const newToon5 = rawCharacters.filter(x => x.name === toon5Name)[0];
        tempSquad.push(newToon1, newToon2, newToon3, newToon4, newToon5);
        const newSquad = tempSquad.map((char) => {
          const newChar = char;
          if (newChar) {
            delete newChar.ability_classes;
            delete newChar.activate_shard_count;
            delete newChar.alignment;
            delete newChar.categories;
            delete newChar.combat_type;
            delete newChar.description;
            delete newChar.gear_levels;
            delete newChar.pk;
            delete newChar.power;
            delete newChar.role;
            delete newChar.ship;
            delete newChar.ship_slot;
            delete newChar.url;
          }
          return newChar;
        });
        resolve(newSquad);
      })
      .catch(err => reject(err));
  });

  return characters;
}

export async function importCharacterData(characters) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/import/characters`, {
    method: 'POST',
    headers: {
      'Content-Type': ['application/json'],
    },
    body: JSON.stringify(characters),
  });

  if (response.status !== 200) {
    throw Error(response.body.message);
  }

  return 'ok';
}
