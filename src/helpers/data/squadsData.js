const baseUrl = process.env.REACT_APP_SQUAD_API_URL;

export async function getSquadData() {
  const response = await fetch(`${baseUrl}`);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }

  return body;
}

export async function addSquad(squad) {
  const response = await fetch(`${baseUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': ['application/json'],
    },
    body: JSON.stringify(squad),
  });
  const body = await response.text();

  if (response.status !== 200) {
    throw Error(response.body.message);
  }

  return { status: 'ok', squadId: body };
}

export async function getSquadStubs(size) {
  const response = await fetch(`${baseUrl}/stubs/${size}`);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
}

export async function getSquadVersionDate() {
  const response = await fetch(`${baseUrl}/versionDate`);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
}

export async function getOldSquadData() {
  const response = await fetch(`${baseUrl}/old`);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }

  return body;
}

export async function importSquadData() {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/import/squads`);

  if (response.status !== 200) {
    throw Error(response.body.message);
  }

  return 'ok';
}
