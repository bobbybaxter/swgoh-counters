/* eslint-disable import/prefer-default-export */
import firebase from 'firebase/app';
import 'firebase/auth';

export async function getPatreonStatus(accessToken) {
  const token = await firebase.auth().currentUser.getIdToken(true);
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/patreon/${accessToken}`, {
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
