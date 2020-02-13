import React from 'react';
import {
  InputGroup,
  InputGroupAddon,
  Input,
  Button,
} from 'reactstrap';

import ProfileBody from '../ProfileBody/ProfileBody';

import './Profile.scss';

class Profile extends React.Component {
  state = {
    inputValue: '',
  }

  handleFetchDataButton = (e) => {
    e.preventDefault();
    this.props.getSwgohData(this.props.userModel.allyCode);
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  handleSubmitButton = (e) => {
    e.preventDefault();
    this.props.submitAllyCode(this.state.inputValue);
  }

  render() {
    const { userInfo, userModel } = this.props;
    let printAllyCodeInput;
    let printFetchButton;
    let printProfileBody;
    let printUserName;

    if (userInfo.units) {
      printProfileBody = <ProfileBody userInfo={userInfo} />;
    } else {
      printProfileBody = '';
    }

    if (userModel.allyCode) {
      printAllyCodeInput = <h5><strong className="text-secondary">Ally Code: </strong>{userModel.allyCode}</h5>;
      printFetchButton = <button className="col-1 btn btn-primary" onClick={this.handleFetchDataButton}>Fetch Data</button>;
      printUserName = <h1 className="col-10">{userModel.username}</h1>;
    } else {
      printAllyCodeInput = <InputGroup className="col-4">
                        <Input value={this.state.inputValue} onChange={this.handleInputChange} placeholder="Input Ally Code"/>
                        <InputGroupAddon addonType="append" onClick={this.handleSubmitButton}><Button>Submit</Button></InputGroupAddon>
                      </InputGroup>;
      printFetchButton = '';
      printUserName = <h1 className="col-10">Profile</h1>;
    }
    return (
      <div className="Profile">
        <div className="col-12 profileHead">
          <span className="col-1"></span>
          { printUserName }
          { printFetchButton }
        </div>
        <div className="allyCodeBox">
          { printAllyCodeInput }
        </div>
        { printProfileBody }
      </div>
    );
  }
}

export default Profile;
