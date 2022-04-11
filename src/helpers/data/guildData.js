import firebase from 'firebase/app'; // eslint-disable-line no-unused-vars
import 'firebase/auth';

const token = 'TOKEN'; // NOTE: in dev/prod, remove this and uncomment firebase token statements below

export async function createGuild( guild ) {
  // const token = await firebase.auth().currentUser.getIdToken( true );
  try {
    const response = await fetch( `${ process.env.REACT_APP_API_URL }/api/guild`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${ token }`,
      },
      body: JSON.stringify( guild ),
    } );
    return await response.json();
  } catch ( err ) {
    console.error( err );
    throw err;
  }
}

export async function deleteGuild( guildId ) {
  // const token = await firebase.auth().currentUser.getIdToken( true );
  try {
    const response = await fetch( `${ process.env.REACT_APP_API_URL }/api/guild/${ guildId }`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${ token }`,
      },
    } );
    return await response.text();
  } catch ( err ) {
    console.error( err );
    throw err;
  }
}

export async function getGuildById( id ) {
  // const token = await firebase.auth().currentUser.getIdToken( true );
  try {
    const response = await fetch( `${ process.env.REACT_APP_API_URL }/api/guild/${ id }`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${ token }`,
      },
    } );
    return await response.json();
  } catch ( err ) {
    console.error( err );
    throw err;
  }
}

export async function updateGuild( guild ) {
  // const token = await firebase.auth().currentUser.getIdToken( true );
  const formattedGuild = {
    ...guild,
    guildTierUsers: guild.guildTierUsers.toString(),
  };
  try {
    const response = await fetch( `${ process.env.REACT_APP_API_URL }/api/guild`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${ token }`,
      },
      body: JSON.stringify( formattedGuild ),
    } );
    return await response.text();
  } catch ( err ) {
    console.error( err );
    throw err;
  }
}
