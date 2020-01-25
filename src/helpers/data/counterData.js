import axios from 'axios';
import apiData from '../apiData.json';

const getCounters = () => new Promise((resolve, reject) => {
  axios.get(`${apiData.baseUrl}/counter/`)
    .then(res => resolve(res.data))
    .catch(err => reject(err));
});

export default { getCounters };
