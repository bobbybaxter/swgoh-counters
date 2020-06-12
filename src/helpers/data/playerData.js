const baseUrl = 'https://cors-anywhere.herokuapp.com/https://swgoh.gg/api/player/';

export default async function getPlayerData(allyCode) {
  const response = await fetch(`${baseUrl}${allyCode}`);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
}
