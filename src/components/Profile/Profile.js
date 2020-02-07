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
    userModel: {
      id: '',
      allyCode: '',
      email: '',
      firebaseUid: '',
      username: '',
    },
    inputValue: '',
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;
    this.setState(prevState => ({
      userModel: {
        ...prevState.userModel,
        email: user.email,
        firebaseUid: user.uid,
      },
    }));
    this.validateAccount(user.uid);
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  submitAllyCode = (e) => {
    const { inputValue } = this.state;
    e.preventDefault();
    swgohData.getUserData(inputValue)
      .then((res) => {
        const newUserModel = {
          allyCode: res.data.ally_code,
          username: res.data.name,
        };
        return newUserModel;
      })
      .then((newUserModel) => {
        this.setState(prevState => ({
          userModel: {
            ...prevState.userModel,
            allyCode: newUserModel.allyCode,
            username: newUserModel.username,
          },
        }));
        userData.updateUserInfo(this.state.userModel);
      })
      .catch(err => console.error(err));
  }

  validateAccount = (firebaseUid) => {
    userData.getUserByFirebaseUid(firebaseUid)
      .then((res) => {
        if (res !== '') {
          this.setState(prevState => ({
            userModel: {
              ...prevState.userModel,
              id: res.id,
              allyCode: res.allyCode,
            },
          }));
        } else {
          userData.createUser();
          console.error('user created');
        }
      })
      .catch(err => console.error(err));
  }

  render() {
    const { userModel } = this.state;
    const printAllyCodeInput = () => {
      let allyCodeBlock = '';
      if (userModel.allyCode === null || userModel.allyCode === '') {
        allyCodeBlock = <InputGroup className="col-4">
                          <Input value={this.state.inputValue} onChange={this.handleInputChange} placeholder="Input Ally Code"/>
                          <InputGroupAddon addonType="append" onClick={this.submitAllyCode}><Button>Submit</Button></InputGroupAddon>
                        </InputGroup>;
      } else {
        allyCodeBlock = <h3>Ally Code: {userModel.allyCode}</h3>;
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
