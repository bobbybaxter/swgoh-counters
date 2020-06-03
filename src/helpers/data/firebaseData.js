import axios from 'axios';

const createUser = userId => new Promise((resolve, reject) => {
  // console.log('createUser path');
  const url = `${process.env.REACT_APP_API_URL}/api/user/`;
  const data = { id: userId };
  const headers = { Authorization: `Bearer ${sessionStorage.getItem('token')}` };

  // TODO: get the data to actually write to the database!
  axios.post(url, data, headers)
    .then(res => resolve(res.data))
    .catch(err => reject(err));
});

const getUserByFirebaseAuthUid = firebaseAuthUid => new Promise((resolve, reject) => {
  // console.log('getUserByFirebaseUid path');

  axios.get(`${process.env.REACT_APP_API_URL}/api/firebase/${firebaseAuthUid}`, {
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

export default { createUser, getUserByFirebaseAuthUid, updateUserInfo };
