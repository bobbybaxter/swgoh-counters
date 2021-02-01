const baseUrl = `${process.env.REACT_APP_API_URL}/api/character`;
//
export async function getAllCharactersOld() {
  try {
    const response = await fetch(`${baseUrl}/old`);
    await response.json();
  } catch (err) {
    throw new Error(err);
  }
}

export async function getAllCharacters() {
  try {
    const response = await fetch(baseUrl);
    return await response.json();
  } catch (err) {
    console.error(err);
    return '';
  }
}

export async function importCharacterData() {
  try {
    await fetch(`${process.env.REACT_APP_API_URL}/api/import/characters`);
  } catch (err) {
    throw new Error(err);
  }
}
