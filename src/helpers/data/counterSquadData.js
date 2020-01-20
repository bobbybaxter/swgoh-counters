import axios from 'axios';

const baseUrl = 'https://localhost:44384/api';

const getCounterSquads = () => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/counterSquad/`)
    .then(res => resolve(res.data))
    .catch(err => reject(err));
});

export default { getCounterSquads };
