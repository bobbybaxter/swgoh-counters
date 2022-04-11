import firebase from 'firebase/app'; // eslint-disable-line no-unused-vars
import 'firebase/auth';

const baseUrl = process.env.REACT_APP_SQUAD_API_URL;

const token = 'TOKEN'; // NOTE: in dev/prod, remove this and uncomment firebase token statements below

export async function getSquadStubs( size, opts ) {
  try {
    const response = await fetch( `${ baseUrl }/stubs/${ size }`, opts );
    return await response.json();
  } catch ( err ) {
    console.error( 'getSquadStubs error', err );
    throw err;
  }
}

export async function updateSquad( squad ) {
  // const token = await firebase.auth().currentUser.getIdToken( true );
  try {
    const response = await fetch( `${ baseUrl }/${ squad.id }`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${ token }`,
      },
      body: JSON.stringify( squad ),
    } );
    return await response.text();
  } catch ( err ) {
    console.error( 'updateSquad error', err );
    throw err;
  }
}
