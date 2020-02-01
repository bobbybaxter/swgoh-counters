import React from 'react';
import firebase from 'firebase/app';
import axios from 'axios';

import './Auth.scss';

axios.interceptors.request.use((request) => {
  const token = sessionStorage.getItem('token');

  if (token != null) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
}, err => Promise.reject(err));

const Auth = () => {
  const googleLoginEvent = (e) => {
    e.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider).then((cred) => {
      // get token from firebase
      cred.user.getIdToken()
        // save the token to the session storage
        .then(token => sessionStorage.setItem('token', token));
    });
  };

  return (
    <div className="Auth mt-3 justify-content-center align-items-center">
      <h1 className="my-5">Login Options</h1>
      <button className="btn-lg btn-danger" onClick={googleLoginEvent}>Google</button>
    </div>
  );
};

export default Auth;
