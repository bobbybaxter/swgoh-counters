const getSquads = async () => {
  const response = await fetch('api/squads');
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
};

export default { getSquads };
