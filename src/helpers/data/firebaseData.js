import axios from 'axios';

const createUser = user => new Promise((resolve, reject) => {
  axios.post(`${process.env.REACT_APP_API_URL}/api/user`,
    user,
    { headers: { authorization: `Bearer ${sessionStorage.getItem('token')}` } })
    .then((res) => {
      resolve(res.data);
    })
    .catch(err => reject(err));
});

const getUserByFirebaseAuthUid = firebaseAuthUid => new Promise((resolve, reject) => {
  axios.get(`${process.env.REACT_APP_API_URL}/api/firebase/${firebaseAuthUid}`,
    { headers: { authorization: `Bearer ${sessionStorage.getItem('token')}` } })
    .then((res) => {
      resolve(res.data);
    })
    .catch(err => reject(err));
});

const updateUserInfo = user => new Promise((resolve, reject) => {
  axios.patch(`${process.env.REACT_APP_API_URL}/api/user/${user.id}`,
    {
      allyCode: user.allyCode,
      email: user.email,
      patreonId: user.patreonId,
      patronStatus: user.patronStatus,
    },
    { headers: { authorization: `Bearer ${sessionStorage.getItem('token')}` } })
    .then((res) => {
      resolve(res.data);
    })
    .catch(err => reject(err));
});

const unlinkPatreonAccount = user => new Promise((resolve, reject) => {
  axios.patch(`${process.env.REACT_APP_API_URL}/api/user/${user.id}`,
    {
      allyCode: user.allyCode,
      email: user.email,
      patreonId: '',
      patronStatus: '',
    },
    { headers: { authorization: `Bearer ${sessionStorage.getItem('token')}` } })
    .then((res) => {
      resolve(res.data);
    })
    .catch(err => reject(err));
});

export default {
  createUser, getUserByFirebaseAuthUid, updateUserInfo, unlinkPatreonAccount,
};
