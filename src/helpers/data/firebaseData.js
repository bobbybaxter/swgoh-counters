import firebase from 'firebase/app';
import 'firebase/auth';

export async function createUser(user) {
  const token = await firebase.auth().currentUser.getIdToken(true);
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/firebase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    throw err;
  }
}

export async function getUserByFirebaseAuthUid(firebaseAuthUid) {
  const token = await firebase.auth().currentUser.getIdToken(true);
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/firebase/${firebaseAuthUid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (err) {
    throw err;
  }
}

export async function updateUserInfo(user) {
  const token = await firebase.auth().currentUser.getIdToken(true);
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/firebase/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        allyCode: user.allyCode,
        email: user.email,
        patreonId: user.patreonId,
        patronStatus: user.patronStatus,
        username: user.username,
      }),
    });
    return await response.text();
  } catch (err) {
    throw err;
  }
}

export async function unlinkPatreonAccount(user) {
  const token = await firebase.auth().currentUser.getIdToken(true);
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/firebase/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        allyCode: user.allyCode,
        email: user.email,
        patreonId: '',
        patronStatus: '',
        username: user.username,
      }),
    });
    return await response.text();
  } catch (err) {
    throw err;
  }
}
