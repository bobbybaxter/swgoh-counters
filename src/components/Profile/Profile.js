import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import {
  InputGroup,
  InputGroupAddon,
  Input,
  Button,
} from 'reactstrap';

import swgohData from '../../helpers/data/swgohData';
import userData from '../../helpers/data/userData';

import './Profile.scss';

class Profile extends React.Component {
  state = {
    firebaseUid: [],
    userEmail: [],
    allyCode: [],
    userInfo: [],
    inputValue: '',
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;
    this.setState({ userEmail: user.email, firebaseUid: user.uid });
    this.validateAccount(user.uid);
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  submitAllyCode = (e) => {
    e.preventDefault();
    swgohData.getUserData(this.state.inputValue)
      .then((res) => {
        console.error(res);
      })
      .catch(err => console.error(err));
  }

  validateAccount = (firebaseUid) => {
    userData.getUserByFirebaseUid(firebaseUid)
      .then((res) => {
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
    const printAllyCodeInput = () => {
      let allyCodeBlock = '';
      if (allyCode === null) {
        allyCodeBlock = <InputGroup className="col-4">
                            <Input value={this.state.inputValue} onChange={this.handleInputChange} placeholder="Input Ally Code"/>
                            <InputGroupAddon addonType="append" onClick={this.submitAllyCode}><Button>Submit</Button></InputGroupAddon>
                        </InputGroup>;
      } else {
        // eslint-disable-next-line eqeqeq
        allyCode == ''
          ? allyCodeBlock = ''
          : allyCodeBlock = `<h3>Ally Code: ${allyCode}</h3>`;
      }
      return allyCodeBlock;
    };
    return (
      <div>
        <h1>Profile</h1>
        <div className="allyCodeBox">
          { printAllyCodeInput() }
        </div>
      </div>
    );
  }
}

export default Profile;
