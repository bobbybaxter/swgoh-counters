const baseUrl = `${process.env.REACT_APP_API_URL}/api/character`;

export async function getAllCharactersOld() {
  const response = await fetch(`${baseUrl}/old`);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }

  return body;
}

export async function getAllCharacters() {
  const response = await fetch(baseUrl);
  const body = await response.json();

  if (!response.ok) {
    throw Error(body);
  }
  return body;
}

export async function importCharacterData() {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/import/characters`);

  if (response.status !== 200) {
    throw Error(response.body.message);
  }

  return 'ok';
}
