import firebase from 'firebase/app';
import 'firebase/auth';

const baseUrl = process.env.REACT_APP_SQUAD_API_URL;

export async function getSquadData() {
  try {
    const response = await fetch(`${baseUrl}`);
    return await response.json();
  } catch (err) {
    throw err;
  }
}

export async function addSquad(squad) {
  const token = await firebase.auth().currentUser.getIdToken(true);
  try {
    const response = await fetch(`${baseUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(squad),
    });
    const body = await response.text();

    return { status: 'ok', squadId: body };
  } catch (err) {
    throw err;
  }
}

export async function updateSquad(squad) {
  const token = await firebase.auth().currentUser.getIdToken(true);
  try {
    const response = await fetch(`${baseUrl}/${squad.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(squad),
    });
    return await response.text();
  } catch (err) {
    throw err;
  }
}

export async function getSquadStubs(size, opts) {
  try {
    const response = await fetch(`${baseUrl}/stubs/${size}`, opts);
    return await response.json();
  } catch (err) {
    throw err;
  }
}

export async function importSquadData() {
  try {
    await fetch(`${process.env.REACT_APP_API_URL}/api/import/squads`);
    return 'ok';
  } catch (err) {
    throw err;
  }
}
