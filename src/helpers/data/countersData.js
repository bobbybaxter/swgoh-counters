import firebase from 'firebase/app'; // eslint-disable-line no-unused-vars
import 'firebase/auth';

const baseUrl = process.env.REACT_APP_COUNTER_API_URL;

const token = 'TOKEN'; // NOTE: in dev/prod, remove this and uncomment firebase token statements below

export async function deleteCounter( id ) {
  // const token = await firebase.auth().currentUser.getIdToken( true );
  try {
    const response = await fetch( `${ baseUrl }/${ id }`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${ token }`,
      },
    } );
    return await response.text();
  } catch ( err ) {
    console.error( 'deleteCounter error', err );
    throw err;
  }
}

export async function updateCounter( counter ) {
  // const token = await firebase.auth().currentUser.getIdToken( true );
  try {
    const response = await fetch( `${ baseUrl }/${ counter.id }`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${ token }`,
      },
      body: JSON.stringify( counter ),
    } );
    return await response.text();
  } catch ( err ) {
    console.error( 'updateCounter error', err );
    throw err;
  }
}

export async function getCounterStubsBySquadIds( leaderId, squadIds, view, size, opts ) {
  try {
    const url = new URL( `${ baseUrl }/getStubsBySquadIds/${ leaderId }` );
    url.searchParams.set( 'view', view );
    url.searchParams.set( 'size', size );
    url.searchParams.set( 'squadIds', squadIds );
    const response = await fetch( url, opts );

    return await response.json();
  } catch ( err ) {
    console.error( 'getCounterStubsBySquadIds error', err );
    throw err;
  }
}

export async function getCounterVariations( opponentLeaderId, counterLeaderId, size, opts ) {
  try {
    const url = new URL( `${ baseUrl }/variations` );
    url.searchParams.set( 'opponentLeaderId', opponentLeaderId );
    url.searchParams.set( 'counterLeaderId', counterLeaderId );
    url.searchParams.set( 'size', size );
    const response = await fetch( url, opts );

    return await response.json();
  } catch ( err ) {
    console.error( 'getCounterVariations error', err );
    throw err;
  }
}
