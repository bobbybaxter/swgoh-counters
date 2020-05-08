// import squadApiUrl from '../../.config.json';

const getSquads = async () => {
  // dev env
  // const response = await fetch('api/squads');
  // const response = await fetch('https://saiastrange-api-env.eba-v4atvzzi.us-east-2.elasticbeanstalk.com/api/squads');
  const response = await fetch(process.env.REACT_APP_SQUAD_API_URL);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body.message);
  }
  return body;
};

export default { getSquads };
