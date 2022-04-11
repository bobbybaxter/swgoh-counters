const baseUrl = `${ process.env.REACT_APP_API_URL }/api/character`;

export default async function getAllCharacters() {
  try {
    const response = await fetch( baseUrl );
    return await response.json();
  } catch ( err ) {
    console.error( 'getAllCharacters error', err );
    throw err;
  }
}
