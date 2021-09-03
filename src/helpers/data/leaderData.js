/* eslint-disable no-return-await */
const baseUrl = process.env.REACT_APP_LEADER_API_URL;

export async function addLeader( leaderData ) {
  const response = await fetch( `${ baseUrl }`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify( leaderData ),
  } );
  const body = await response.text();

  return { status: 'ok', squadId: body };
}

export async function deleteLeader( { squadId, view, battleType } ) {
  const response = await fetch( `${ baseUrl }/${ squadId }/${ view }/${ battleType }`, {
    method: 'DELETE',
  } );
  return await response.text();
}

export async function getLeaders( opts ) {
  const response = await fetch( `${ baseUrl }`, opts );
  return await response.json();
}
