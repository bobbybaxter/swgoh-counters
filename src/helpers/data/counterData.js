import axios from 'axios';

const baseUrl = 'https://localhost:44384/api';

const getCounters = () => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/counter/`)
    .then(res => resolve(res.data))
    .catch(err => reject(err));
});

export default { getCounters };
