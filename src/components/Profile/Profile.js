import React from 'react';
import {
  InputGroup,
  InputGroupAddon,
  Input,
  Button,
} from 'reactstrap';

import './Profile.scss';

class Profile extends React.Component {
  state = {
    inputValue: '',
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  handleSubmitButton = (e) => {
    this.props.submitAllyCode(e, this.state.inputValue);
  }

  render() {
    const { userModel } = this.props;
    const printAllyCodeInput = () => {
      let allyCodeBlock = '';
      if (userModel.allyCode === null || userModel.allyCode === '' || userModel.allyCode === undefined) {
        allyCodeBlock = <InputGroup className="col-4">
                          <Input value={this.state.inputValue} onChange={this.handleInputChange} placeholder="Input Ally Code"/>
                          <InputGroupAddon addonType="append" onClick={this.handleSubmitButton}><Button>Submit</Button></InputGroupAddon>
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
