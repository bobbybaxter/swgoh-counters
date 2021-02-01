const baseUrl = 'https://cors-anywhere.herokuapp.com/https://swgoh.gg/api/player/';

export default async function getPlayerData(allyCode) {
  try {
    const response = await fetch(`${baseUrl}${allyCode}`);

    if (response.status === 404) {
      throw new Error('User does not exist.');
    }

    return await response.json();
  } catch (err) {
    throw new Error(err);
  }
}
