import firebase from 'firebase/app';
import 'firebase/auth';

const baseUrl = process.env.REACT_APP_COUNTER_API_URL;

export async function getCounterData() {
  try {
    const response = await fetch(`${baseUrl}/old`);
    return await response.json();
  } catch (err) {
    throw new Error(err);
  }
}

export async function getCounterById(id, opts) {
  try {
    const response = await fetch(`${baseUrl}/${id}`, opts);
    return await response.json();
  } catch (err) {
    throw new Error(err);
  }
}

export async function addCounter(counter) {
  const token = await firebase.auth().currentUser.getIdToken(true);
  try {
    const response = await fetch(`${baseUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(counter),
    });
    const body = await response.text();
    return { status: 'ok', counterId: body };
  } catch (err) {
    throw new Error(err);
  }
}

export async function updateCounter(counter) {
  const token = await firebase.auth().currentUser.getIdToken(true);
  try {
    await fetch(`${baseUrl}/${counter.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(counter),
    });
    return 'ok';
  } catch (err) {
    throw new Error('Error updating counter', err);
  }
}

export async function importCounterData() {
  try {
    await fetch(`${process.env.REACT_APP_API_URL}/api/import/counters`);
    return 'ok';
  } catch (err) {
    throw new Error(err);
  }
}

export async function getCounterStubsBySquadId(squadId, view, type, opts) {
  try {
    const url = new URL(`${baseUrl}/getStubsBySquadId/${squadId}`);
    url.searchParams.set('view', view);
    url.searchParams.set('type', type);

    const response = await fetch(url, opts);
    return await response.json();
  } catch (err) {
    throw new Error(err);
  }
}
