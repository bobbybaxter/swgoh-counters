/* eslint-disable no-return-await */
const baseUrl = process.env.REACT_APP_SWGOH_API_URL;

export async function getLeadersBySeason( season ) {
  const response = await fetch( `${ baseUrl }/leaders/${ season }` );
  return await response.text();
}

export async function getSquadsBySeason( season ) {
  const response = await fetch( `${ baseUrl }/squads/${ season }` );
  return await response.text();
}

export async function getCountersBySeason( season ) {
  const response = await fetch( `${ baseUrl }/counters/${ season }` );
  return await response.text();
}

export async function getSeasonData( season ) {
  const response = await fetch( `${ baseUrl }/counters/SeasonData/${ season }` );
  return await response.text();
}
