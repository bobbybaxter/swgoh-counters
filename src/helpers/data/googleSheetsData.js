import axios from 'axios';
import apiData from '../apiData.json';

const getCounters = () => new Promise((resolve, reject) => {
  axios.get(`${apiData.counterSheetUrl}`)
    .then(res => resolve(res.data))
    .catch(err => reject(err));
});

const getTeams = () => new Promise((resolve, reject) => {
  axios.get(`${apiData.teamSheetUrl}`)
    .then(res => resolve(res.data))
    .catch(err => reject(err));
});

export default { getCounters, getTeams };
