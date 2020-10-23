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
