import React, { useEffect, useState } from 'react';
import {
  Button, Form, FormGroup, Input,
} from 'reactstrap';

import allCharacters from '../../helpers/data/characters.json';
import getPlayerData from '../../helpers/data/playerData';

import flatten from '../../helpers/flatten';
import mergeCharacterAndPlayerData from '../../helpers/mergeCharacterAndPlayerData';

import CharacterTable from '../CharacterTable/CharacterTable';
import RefreshTimer from '../RefreshTimer/RefreshTimer';

import './Profile.scss';
import firebaseData from '../../helpers/data/firebaseData';

// TEST: treating /db as localStorage
// import userDataDb from '../../helpers/fakeDb/userData.json';
// import userUnitsDb from '../../helpers/fakeDb/userUnits.json';

const userUnitsInStorage = JSON.parse(localStorage.getItem('userUnits'));
const userDataInStorage = JSON.parse(localStorage.getItem('userData'));
const timeoutDateInStorage = JSON.parse(localStorage.getItem('timeoutDate'));
const isRefreshDisabledInStorage = JSON.parse(localStorage.getItem('isRefreshDisabled'));

export default function Profile(props) {
  const [userData, setUserData] = useState(userDataInStorage || '');
  const [userUnits, setUserUnits] = useState(userUnitsInStorage || '');
  const [isRefreshDisabled, setIsRefreshDisabled] = useState(isRefreshDisabledInStorage || false);
  const [timeoutCompletionDate, setTimeoutCompletionDate] = useState(timeoutDateInStorage || '');

  const setTimeout = () => {
    // const timeoutDate = new Date().getTime() + 10000;
    const timeoutDate = new Date().getTime() + 86400000;
    setTimeoutCompletionDate(timeoutDate);
    localStorage.setItem('timeoutDate', timeoutDate);
  };

  const setPlayerData = () => {
    // setUserData(userDataDb);
    // localStorage.setItem('userData', JSON.stringify(userDataDb));
    // setUserUnits(userUnitsDb);
    // localStorage.setItem('userUnits', JSON.stringify(userUnitsDb));
    getPlayerData(props.user.allyCode)
      .then((res) => {
        setUserData(res.data);
        localStorage.setItem('userData', JSON.stringify(res.data));
        return fixRelicTierLevels(res).filter(char => char.combat_type !== 2);
      })
      .then(res => mergeCharacterAndPlayerData(allCharacters.data, res))
      .then((res) => {
        res.sort((char1, char2) => (char1.name < char2.name ? -1 : 1));
        setUserUnits(res);
        localStorage.setItem('userUnits', JSON.stringify(res));
      });
  };

  useEffect(() => {
    if (!userData && props.user.allyCode) {
      setPlayerData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearAllyCode = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userUnits');
    setUserUnits('');
    setUserData('');
    props.handleClearAllyCode();
  };

  const fixRelicTierLevels = res => res.units.map((char) => {
    const flatChar = flatten(char);
    switch (flatChar.relic_tier) {
      case 1:
        flatChar.relic_tier = 0;
        break;
      case 2:
        flatChar.relic_tier = 1;
        break;
      default:
        flatChar.relic_tier -= 2;
    }
    return flatChar;
  });

  const refreshPlayerData = (e) => {
    e.preventDefault();
    setPlayerData();
    setTimeout();
  };

  const disableRefreshButtons = (e) => {
    setIsRefreshDisabled(true);
    localStorage.setItem('isRefreshDisabled', true);
  };

  const enableRefreshButtons = (e) => {
    setIsRefreshDisabled(false);
    localStorage.setItem('isRefreshDisabled', false);
  };

  const submitAllyCode = (e) => {
    e.preventDefault();
    console.log('props.user :>> ', props.user);
    firebaseData.updateUserInfo(props.user);
    setPlayerData();
    setTimeout();
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
        onChange={props.handleAllyCode}
      />
    </FormGroup>
    <Button type="submit" onClick={submitAllyCode}>Submit</Button>
  </Form>;

  return (
    <div className="Profile">
      <div className="profileWrapper">
        <h1>{userData ? userData.name : ''}</h1>
        {userUnits ? '' : allyCodeForm}
        <div className="profileButtons">
          <RefreshTimer
            key="refreshTimer"
            timeoutCompletionDate={timeoutCompletionDate}
            haveUserUnits={!!userUnits}
            refreshPlayerData={refreshPlayerData}
            clearAllyCode={clearAllyCode}
            isRefreshDisabled={isRefreshDisabled}
            enableRefreshButtons={enableRefreshButtons}
            disableRefreshButtons={disableRefreshButtons}
          />
        </div>
        {/* <Button onClick={handleMerge}>Merge</Button> */}

        {userUnits
          ? <CharacterTable
            userUnits={userUnits}
            />
          : ''
        }
      </div>
    </div>
  );
}
