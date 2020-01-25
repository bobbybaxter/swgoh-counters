import axios from 'axios';
import apiData from '../apiData.json';

const getCounterSquads = () => new Promise((resolve, reject) => {
  axios.get(`${apiData.baseUrl}/counterSquad/`)
    .then(res => resolve(res.data))
    .catch(err => reject(err));
});

export default { getCounterSquads };
