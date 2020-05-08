import React, { useState, useEffect } from 'react';
import {
  Button, Form, FormGroup, Input,
} from 'reactstrap';

import getPlayerData from '../../helpers/data/playerData';

import './Profile.scss';

export default function Profile() {
  const [userData, setUserData] = useState();
  const [allyCode, setAllyCode] = useState();

  useEffect(() => {
    if (localStorage.getItem('userData')) {
      setUserData(JSON.parse(localStorage.getItem('userData')));
    }
  }, [userData]);

  const clearAllyCode = () => {
    localStorage.clear();
  };

  const handleAllyCode = (e) => {
    setAllyCode(e.target.value);
  };

  const submitAllyCode = () => {
    getPlayerData(allyCode).then((res) => {
      setUserData(res);
      localStorage.setItem('userData', JSON.stringify(res));
    });
  };

  return (
    <div className="Profile">
      <h1>Profile</h1>
      <Form inline>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Input
            type="text"
            name="allyCode"
            id="allyCode"
            placeholder="Ally Code"
            onChange={handleAllyCode}
          />
        </FormGroup>
        <Button onClick={submitAllyCode}>Submit</Button>
      </Form>
      <Button onClick={clearAllyCode}>Clear Storage</Button>
    </div>
  );
}
