import axios from 'axios';

const createUser = () => new Promise((resolve, reject) => {
  // console.log('createUser path');

  axios.post(`${process.env.REACT_APP_API_URL}/api/user/`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  })
    .then(res => resolve(res.data))
    .catch(err => reject(err));
});

const getUserByFirebaseUid = firebaseUid => new Promise((resolve, reject) => {
  // console.log('getUserByFirebaseUid path');

  axios.get(`${process.env.REACT_APP_API_URL}/api/firebase/${firebaseUid}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  })
    .then((res) => {
      console.log('firebaseData getUserByFirebaseUid :>> ', res);
      resolve(res.data);
    })
    .catch(err => reject(err));
});

const updateUserInfo = user => new Promise((resolve, reject) => {
  // console.log('updateUserInfo path');

  axios.put(`${process.env.REACT_APP_API_URL}/api/user/${user.id}`,
    { allyCode: user.allyCode },
    { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } })
    .then(res => resolve(res.data))
    .catch(err => reject(err));
});

export default { createUser, getUserByFirebaseUid, updateUserInfo };
