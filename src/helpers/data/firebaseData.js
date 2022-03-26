import firebase from 'firebase/app';
import 'firebase/auth';
import {
  mockCreateGuild,
  mockDeleteGuild,
  mockGetGuildById,
  mockGetUserByFirebaseAuthId,
  mockPatreonCreate,
  mockUnlinkPatreonAccount,
  mockUpdateGuild,
  mockUpdateUserInfo,
} from './mockEndpoints';

export async function createGuild( guild ) {
  // NOTE: mock
  return mockCreateGuild();

  // NOTE: deprecated
  // const token = await firebase.auth().currentUser.getIdToken( true );
  // try {
  //   const response = await fetch( `${ process.env.REACT_APP_API_URL }/api/guild`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       authorization: `Bearer ${ token }`,
  //     },
  //     body: JSON.stringify( guild ),
  //   } );
  //   return await response.json();
  // } catch ( err ) {
  //   console.error( err );
  //   throw err;
  // }
}

export async function createUser( user ) {
  // NOTE: mock
  return mockPatreonCreate();

  // NOTE: deprecated
  // const token = await firebase.auth().currentUser.getIdToken( true );
  // try {
  // const response = await fetch( `${ process.env.REACT_APP_API_URL }/api/firebase`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     authorization: `Bearer ${ token }`,
  //   },
  //   body: JSON.stringify( user ),
  // } );
  // return await response.json();
  // } catch ( err ) {
  //   console.error( err );
  //   throw err;
  // }
}

export async function deleteGuild( guildId ) {
  // NOTE: mock
  return mockDeleteGuild();

  // NOTE: deprecated
  // const token = await firebase.auth().currentUser.getIdToken( true );
  // try {
  //   const response = await fetch( `${ process.env.REACT_APP_API_URL }/api/guild/${ guildId }`, {
  //     method: 'DELETE',
  //     headers: {
  //       authorization: `Bearer ${ token }`,
  //     },
  //   } );
  //   return await response.text();
  // } catch ( err ) {
  //   console.error( err );
  //   throw err;
  // }
}

export async function getGuildById( id ) {
  // NOTE: mock
  return mockGetGuildById();

  // NOTE: deprecated
  // const token = await firebase.auth().currentUser.getIdToken( true );
  // try {
  //   const response = await fetch( `${ process.env.REACT_APP_API_URL }/api/guild/${ id }`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       authorization: `Bearer ${ token }`,
  //     },
  //   } );
  //   return await response.json();
  // } catch ( err ) {
  //   console.error( err );
  //   throw err;
  // }
}

export async function getUserByFirebaseAuthUid( firebaseAuthUid ) {
  // NOTE: mock
  return mockGetUserByFirebaseAuthId();

  // NOTE: deprecated
  // const token = await firebase.auth().currentUser.getIdToken( true );
  // try {
  //   const response = await fetch( `${ process.env.REACT_APP_API_URL }/api/firebase/${ firebaseAuthUid }`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       authorization: `Bearer ${ token }`,
  //     },
  //   } );
  //   return await response.json();
  // } catch ( err ) {
  //   console.error( err );
  //   throw err;
  // }
}

export async function updateGuild( guild ) {
  // NOTE: mock
  return mockUpdateGuild();

  // NOTE: deprecated
  // const token = await firebase.auth().currentUser.getIdToken( true );
  // const formattedGuild = {
  //   ...guild,
  //   guildTierUsers: guild.guildTierUsers.toString(),
  // };
  // try {
  //   const response = await fetch( `${ process.env.REACT_APP_API_URL }/api/guild`, {
  //     method: 'PATCH',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       authorization: `Bearer ${ token }`,
  //     },
  //     body: JSON.stringify( formattedGuild ),
  //   } );
  //   return await response.text();
  // } catch ( err ) {
  //   console.error( err );
  //   throw err;
  // }
}

export async function updateUserInfo( user ) {
  // NOTE: mock
  return mockUpdateUserInfo();

  // NOTE: deprecated
  // const token = await firebase.auth().currentUser.getIdToken( true );
  // try {
  //   const response = await fetch( `${ process.env.REACT_APP_API_URL }/api/firebase`, {
  //     method: 'PATCH',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       authorization: `Bearer ${ token }`,
  //     },
  //     body: JSON.stringify( user ),
  //   } );
  //   return await response.text();
  // } catch ( err ) {
  //   console.error( err );
  //   throw err;
  // }
}

export async function unlinkPatreonAccount( user ) {
  // NOTE: mock
  return mockUnlinkPatreonAccount();

  // NOTE: deprecated
  // const token = await firebase.auth().currentUser.getIdToken( true );
  // const {
  //   allyCode,
  //   email,
  //   guildId,
  //   guildName,
  //   username,
  // } = user;
  // try {
  //   const response = await fetch( `${ process.env.REACT_APP_API_URL }/api/firebase/${ user.id }`, {
  //     method: 'PATCH',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       authorization: `Bearer ${ token }`,
  //     },
  //     body: JSON.stringify( {
  //       accessToken: '',
  //       allyCode,
  //       email,
  //       expiresIn: '',
  //       guildId,
  //       guildName,
  //       patreonId: '',
  //       patronStatus: '',
  //       refreshToken: '',
  //       tier: '',
  //       username,
  //     } ),
  //   } );
  //   return await response.text();
  // } catch ( err ) {
  //   console.error( err );
  //   throw err;
  // }
}
