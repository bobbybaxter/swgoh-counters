
export default async function getPlayerData(allyCode) {
  const url = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://swgoh.gg/api/player/${allyCode}`)}`;
  try {
    const response = await fetch(`${url}`);

    if (response.status === 404) {
      throw new Error('User does not exist.');
    }

    return await response.json();
  } catch (err) {
    throw new Error(err);
  }
}
