const baseUrl = process.env.REACT_APP_SWGOH_API_URL;

export async function getLeadersBySeason(season) {
  try {
    const response = await fetch(`${baseUrl}/leaders/${season}`);
    return await response.text();
  } catch (err) {
    throw err;
  }
}
