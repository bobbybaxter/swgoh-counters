import axios from 'axios';

const getTeams = () => new Promise((resolve, reject) => {
  axios.get('https://api.sheety.co/a710e43e-2721-45bb-b722-dafafea5b152')
    .then((res) => {
      resolve(res.data);
    })
    .catch(err => reject(err));
});

export default { getTeams };
