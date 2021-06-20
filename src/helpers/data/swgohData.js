const baseUrl = process.env.REACT_APP_SWGOH_API_URL;

export async function getLeadersBySeason(season) {
  try {
    const response = await fetch(`${baseUrl}/leaders/${season}`);
    return await response.text();
  } catch (err) {
    throw err;
  }
}

export async function getSquadsBySeason(season) {
  try {
    const response = await fetch(`${baseUrl}/squads/${season}`);
    return await response.text();
  } catch (err) {
    throw err;
  }
}

export async function getCountersBySeason(season) {
  try {
    const response = await fetch(`${baseUrl}/counters/${season}`);
    return await response.text();
  } catch (err) {
    throw err;
  }
}

export async function getSeasonData(season) {
  try {
    const response = await fetch(`${baseUrl}/counters/SeasonData/${season}`);
    return await response.text();
  } catch (err) {
    throw err;
  }
}
