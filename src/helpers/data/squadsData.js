export default async function getSquadData() {
  const response = await fetch(process.env.REACT_APP_SQUAD_API_URL);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
}
