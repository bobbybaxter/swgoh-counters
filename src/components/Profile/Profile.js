import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import {
  InputGroup,
  InputGroupAddon,
  Input,
  Button,
} from 'reactstrap';

import userData from '../../helpers/data/userData';

import './Profile.scss';

class Profile extends React.Component {
  state = {
    firebaseUid: [],
    userEmail: [],
    allyCode: [],
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
    const { allyCode } = this.state;
    const printAllyCode = () => {
      let allyCodeBlock = '';
      if (allyCode !== null) {
        allyCodeBlock = `<h3>Ally Code: ${allyCode}</h3>`;
      } else {
        allyCodeBlock = <InputGroup className="col-4">
                            <Input placeholder="Input Ally Code"/>
                            <InputGroupAddon addonType="append"><Button>Submit</Button></InputGroupAddon>
                        </InputGroup>;
      }
      return allyCodeBlock;
    };
    return (
      <div>
        <h1>Profile</h1>
        <div className="allyCodeBox">
          { printAllyCode() }
        </div>
      </div>
    );
  }
}

export default Profile;
