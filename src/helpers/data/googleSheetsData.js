import axios from 'axios';

const getCounters = () => new Promise((resolve, reject) => {
  axios.get('https://api.sheety.co/e505ae20-ec5b-46e8-a86f-7149b9823b64')
    .then((res) => {
      resolve(res.data);
    })
    .catch(err => reject(err));
});

const getTeams = () => new Promise((resolve, reject) => {
  axios.get('https://api.sheety.co/a710e43e-2721-45bb-b722-dafafea5b152')
    .then((res) => {
      resolve(res.data);
    })
    .catch(err => reject(err));
});

export default { getCounters, getTeams };
