import axios from 'axios';
// import apiData from '../apiData.json';

const createUser = () => new Promise((resolve, reject) => {
  axios.post('https://localhost:44384/api/user/')
    .then(res => resolve(res.data))
    .catch(err => reject(err));
});

const getUserByFirebaseUid = firebaseUid => new Promise((resolve, reject) => {
  // axios.get(`${apiData.baseUrl}/user/`)
  axios.get(`https://localhost:44384/api/user/firebase/${firebaseUid}`)
    .then(res => resolve(res.data))
    .catch(err => reject(err));
});

const updateUserInfo = userModel => new Promise((resolve, reject) => {
  axios.put(`https://localhost:44384/api/user/allyCode/${userModel.allyCode}`, { userModel })
    .then(res => resolve(res.data))
    .catch(err => reject(err));
});

export default { createUser, getUserByFirebaseUid, updateUserInfo };
