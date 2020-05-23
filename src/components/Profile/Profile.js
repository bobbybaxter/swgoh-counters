import React, { useState, useEffect } from 'react';
import {
  Button, Form, FormGroup, Input,
} from 'reactstrap';

import characterData from '../../helpers/data/characters.json';
import getPlayerData from '../../helpers/data/playerData';

import flatten from '../../helpers/flatten';
import mergeCharacterAndPlayerData from '../../helpers/mergeCharacterAndPlayerData';

import CharacterTable from '../CharacterTable/CharacterTable';

import './Profile.scss';

export default function Profile() {
  const [allyCode, setAllyCode] = useState();
  const [allCharacters, setAllCharacters] = useState();
  const [userData, setUserData] = useState();
  const [userUnits, setUserUnits] = useState();

  const importCharacterData = () => {
    if (localStorage.getItem('characterData')) {
      setAllCharacters(JSON.parse(localStorage.getItem('characterData')));
    } else {
      setAllCharacters(characterData.data);
      localStorage.setItem('characterData', JSON.stringify(characterData.data));
    }
  };

  const importUserUnits = () => {
    if (localStorage.getItem('userUnits')) {
      setUserUnits(JSON.parse(localStorage.getItem('userUnits')));
    }
  };

  const importUserData = () => {
    if (localStorage.getItem('userData')) {
      setUserData(JSON.parse(localStorage.getItem('userData')));
    }
  };

  useEffect(() => {
    importCharacterData();
    importUserUnits();
    importUserData();
  }, []);

  const clearAllyCode = () => {
    localStorage.clear();
    setUserUnits('');
    setUserData('');
  };

  const handleAllyCode = (e) => {
    setAllyCode(e.target.value);
  };

  const submitAllyCode = () => {
    getPlayerData(allyCode)
      .then((res) => {
        setUserData(res.data);
        localStorage.setItem('userData', JSON.stringify(res.data));
        return res.units.map((char) => {
          const flatChar = flatten(char);
          flatChar.relic_tier -= 1;
          return flatChar;
        }).filter(char => char.combat_type !== 2);
      })
      .then(res => mergeCharacterAndPlayerData(allCharacters, res))
      .then((res) => {
        res.sort((char1, char2) => (char1.name < char2.name ? -1 : 1));
        setUserUnits(res);
        localStorage.setItem('userUnits', JSON.stringify(res));
      });
  };

  // temp
  // const handleMerge = () => {
  //   mergeCharacterAndPlayerData(allCharacters, userUnits);
  // };

  const allyCodeForm = <Form inline>
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
  </Form>;

  return (
    <div className="Profile container">
      <h1>{userData ? userData.name : ''}</h1>
      {userUnits ? '' : allyCodeForm}
      <div className="profileButtons">
        {userUnits ? <Button className="btn-sm" onClick={clearAllyCode}>Clear Ally Code</Button> : '' }
      </div>
      {/* <Button onClick={handleMerge}>Merge</Button> */}

      {userUnits
        ? <CharacterTable
          userUnits={userUnits}
          />
        : ''
      }
    </div>
  );
}
