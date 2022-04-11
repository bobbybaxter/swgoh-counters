// NOTE: admin functions used to interface with database to import fresh data
export async function importCharacterData() {
  try {
    return await fetch( `${ process.env.REACT_APP_API_URL }/api/import/characters` );
  } catch ( err ) {
    console.error( 'importCharacterData error', err );
    throw err;
  }
}

export async function importCounterData() {
  try {
    await fetch( `${ process.env.REACT_APP_API_URL }/api/import/counters` );
    return 'ok';
  } catch ( err ) {
    console.error( 'importCounterData error', err );
    throw err;
  }
}

export async function importSquadData() {
  try {
    await fetch( `${ process.env.REACT_APP_API_URL }/api/import/squads` );
    return 'ok';
  } catch ( err ) {
    console.error( 'importSquadData error', err );
    throw err;
  }
}
