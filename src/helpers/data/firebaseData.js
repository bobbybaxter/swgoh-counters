import firebase from 'firebase/app'; // eslint-disable-line no-unused-vars
import 'firebase/auth';

const token = 'TOKEN'; // NOTE: in dev/prod, remove this and uncomment firebase token statements below

export async function createUser( user ) {
  // const token = await firebase.auth().currentUser.getIdToken( true );
  try {
    const response = await fetch( `${ process.env.REACT_APP_API_URL }/api/firebase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${ token }`,
      },
      body: JSON.stringify( user ),
    } );
    return await response.json();
  } catch ( err ) {
    console.error( err );
    throw err;
  }
}

export async function getUserByFirebaseAuthUid( firebaseAuthUid ) {
  try {
    const response = await fetch( `${ process.env.REACT_APP_API_URL }/api/firebase/${ firebaseAuthUid }` );
    return await response.json();
  } catch ( err ) {
    console.error( err );
    throw err;
  }
}

export async function updateUserInfo( user ) {
  // const token = await firebase.auth().currentUser.getIdToken( true );
  try {
    const response = await fetch( `${ process.env.REACT_APP_API_URL }/api/firebase`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${ token }`,
      },
      body: JSON.stringify( user ),
    } );
    return await response.text();
  } catch ( err ) {
    console.error( err );
    throw err;
  }
}

export async function unlinkPatreonAccount( user ) {
  // const token = await firebase.auth().currentUser.getIdToken( true );
  try {
    const response = await fetch( `${ process.env.REACT_APP_API_URL }/api/firebase/${ user.id }`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${ token }`,
      },
      body: JSON.stringify( {
        ...user,
        accessToken: '',
        expiresIn: '',
        patreonId: '',
        patronStatus: '',
        refreshToken: '',
        tier: '',
      } ),
    } );
    return await response.text();
  } catch ( err ) {
    console.error( err );
    throw err;
  }
}
