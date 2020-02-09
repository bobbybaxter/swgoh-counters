import axios from 'axios';
import apiData from '../apiData.json';

const createUser = () => new Promise((resolve, reject) => {
  axios.post(`${apiData.testUrl}/user/`)
    .then(res => resolve(res.data))
    .catch(err => reject(err));
});

const getUserByFirebaseUid = firebaseUid => new Promise((resolve, reject) => {
  axios.get(`${apiData.testUrl}/user/firebase/${firebaseUid}`)
    .then(res => resolve(res.data))
    .catch(err => reject(err));
});

const updateUserInfo = userModel => new Promise((resolve, reject) => {
  axios.put(`${apiData.testUrl}/user/${userModel.id}`, {
    AllyCode: userModel.allyCode,
    Username: userModel.username,
  })
    .then(res => resolve(res.data))
    .catch(err => reject(err));
});

export default { createUser, getUserByFirebaseUid, updateUserInfo };
