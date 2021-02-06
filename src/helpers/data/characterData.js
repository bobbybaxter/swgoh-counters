const baseUrl = `${process.env.REACT_APP_API_URL}/api/character`;

export async function getAllCharacters() {
  try {
    const response = await fetch(baseUrl);
    return await response.json();
  } catch (err) {
    throw err;
  }
}

export async function importCharacterData() {
  try {
    return await fetch(`${process.env.REACT_APP_API_URL}/api/import/characters`);
  } catch (err) {
    throw err;
  }
}
