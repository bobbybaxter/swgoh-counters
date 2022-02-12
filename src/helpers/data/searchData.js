import firebase from 'firebase/app';
import 'firebase/auth';

const baseUrl = process.env.REACT_APP_SEARCH_API_URL;

export async function searchCounter( data ) {
  const token = await firebase.auth().currentUser.getIdToken( true );
  const response = await fetch( `${ baseUrl }/counter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${ token }`,
    },
    body: JSON.stringify( data ),
  } );
  const body = await response.json();

  return body;
}

export async function searchSquad( data ) {
  const token = await firebase.auth().currentUser.getIdToken( true );
  const response = await fetch( `${ baseUrl }/squad`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${ token }`,
    },
    body: JSON.stringify( data ),
  } );
  const body = await response.json();

  return body;
}

export async function searchCharacter( data ) {
  const token = await firebase.auth().currentUser.getIdToken( true );
  const response = await fetch( `${ baseUrl }/character`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${ token }`,
    },
    body: JSON.stringify( data ),
  } );
  const body = await response.json();

  return body;
}
