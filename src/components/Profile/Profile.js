import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

import userData from '../../helpers/data/userData';

import './Profile.scss';

class Profile extends React.Component {
  state = {
    firebaseUid: [],
    userEmail: [],
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;
    this.setState({ userEmail: user.email, firebaseUid: user.uid });
    this.validateAccount(user.uid);
  }

  validateAccount = (firebaseUid) => {
    userData.getUserByFirebaseUid(firebaseUid)
      .then((res) => {
        console.error(res);
        if (res !== '') {
          this.setState({ allyCode: res.allyCode });
        } else {
          userData.createUser();
          console.error('user created');
        }
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <div>
        <h1>Profile</h1>
      </div>
    );
  }
}

export default Profile;
