import firebase from 'firebase/app'; // eslint-disable-line no-unused-vars
import 'firebase/auth';

const baseUrl = process.env.REACT_APP_VIDEOLINK_API_URL;

const token = 'TOKEN'; // NOTE: in dev/prod, remove this and uncomment firebase token statements below

export async function addVideoLink( videoLink ) {
  // const token = await firebase.auth().currentUser.getIdToken( true );
  try {
    const response = await fetch( `${ baseUrl }`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${ token }`,
      },
      body: JSON.stringify( videoLink ),
    } );
    return await response.text();
  } catch ( err ) {
    console.error( 'addVideoLink error', err );
    throw err;
  }
}

export async function deleteVideoLink( videoLink ) {
  // const token = await firebase.auth().currentUser.getIdToken( true );
  try {
    const response = await fetch( `${ baseUrl }/${ videoLink.id }`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${ token }`,
      },
      body: JSON.stringify( videoLink ),
    } );
    return await response.text();
  } catch ( err ) {
    console.error( 'deleteVideoLink error', err );
    throw err;
  }
}

export async function updateVideoLink( videoLink ) {
  // const token = await firebase.auth().currentUser.getIdToken( true );
  try {
    const response = await fetch( `${ baseUrl }/${ videoLink.id }`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${ token }`,
      },
      body: JSON.stringify( videoLink ),
    } );
    return await response.text();
  } catch ( err ) {
    console.error( 'updateVideoLink error', err );
    throw err;
  }
}
