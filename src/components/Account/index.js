import React, { useEffect, useState } from 'react';
import {
  Button, Form, FormGroup, Input,
} from 'reactstrap';
import MetaTags from 'react-meta-tags';
import PropTypes from 'prop-types';
import { ContainerColumn } from 'src/styles/style';
import {
  AccountHeader,
  AccountHeaderCenter,
  AccountHeaderLeft,
  AccountHeaderRight,
  AccountWrapper,
} from './style';

import allCharacters from '../../helpers/data/characters.json';
import getPlayerData from '../../helpers/data/playerData';

import flatten from '../../helpers/flatten';
import mergeCharacterAndPlayerData from '../../helpers/mergeCharacterAndPlayerData';

import CharacterTable from '../CharacterTable/CharacterTable';
import AccountButtons from './AccountButtons';

import firebaseData from '../../helpers/data/firebaseData';

const userUnitsInStorage = JSON.parse(localStorage.getItem('userUnits'));
const userDataInStorage = JSON.parse(localStorage.getItem('userData'));
const timeoutDateInStorage = JSON.parse(localStorage.getItem('timeoutDate'));
const isRefreshDisabledInStorage = JSON.parse(localStorage.getItem('isRefreshDisabled'));

const patreonLink = `https://patreon.com/oauth2/authorize?response_type=code&client_id=${process.env.REACT_APP_PATREON_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_PATREON_REDIRECT}&scope=identity${encodeURI('[email]')}%20identity`;

// TODO: Add tests
export default function Account(props) {
  Account.propTypes = {
    authenticated: PropTypes.bool,
    handleClearAllyCode: PropTypes.func,
    handleAllyCode: PropTypes.func,
    unlinkPatreonAccount: PropTypes.func,
    user: PropTypes.object,
  };

  const [userData, setUserData] = useState(userDataInStorage || '');
  const [userUnits, setUserUnits] = useState(userUnitsInStorage || '');
  const [isRefreshDisabled, setIsRefreshDisabled] = useState(isRefreshDisabledInStorage || false);
  const [timeoutCompletionDate, setTimeoutCompletionDate] = useState(timeoutDateInStorage || '');

  const setTimeout = () => {
    const timeoutDate = new Date().getTime() + 86400000;
    setTimeoutCompletionDate(timeoutDate);
    localStorage.setItem('timeoutDate', timeoutDate);
  };

  const setPlayerData = () => {
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

  useEffect(() => {
    // adds usernames to old accounts that don't currently have them
    async function updateUser() {
      if (userData && props.user.allyCode && !props.user.username) {
        const userToUpdate = {
          id: props.user.id,
          allyCode: props.user.allyCode,
          email: props.user.email,
          patreonId: props.user.patreonId,
          patronStatus: props.user.patronStatus,
          username: userData.name,
        };
        await firebaseData.updateUserInfo(userToUpdate);
      }
    }

    updateUser();
  }, [props.user.allyCode,
    props.user.email,
    props.user.id,
    props.user.patreonId,
    props.user.patronStatus,
    props.user.username,
    userData]);

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
    firebaseData.updateUserInfo(props.user);
    setPlayerData();
    setTimeout();
  };

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

  const handleUnlinkPatreonAccount = () => {
    firebaseData.unlinkPatreonAccount(props.user);
    props.unlinkPatreonAccount();
  };

  const togglePatreonButton = !props.user.patreonId
    ? <Button className="btn-sm" href={patreonLink}>
          Link Patreon
        </Button>
    : <Button className="btn-sm" onClick={handleUnlinkPatreonAccount}>
          Unlink Patreon
        </Button>;

  return (
    <ContainerColumn className="Account">
      <MetaTags>
        <title>Account</title>
        <meta name="description" content="Link your SWGOH allycode and Patreon email"/>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </MetaTags>
      <AccountWrapper>
        <AccountHeader>
          <AccountHeaderLeft className="col-4"></AccountHeaderLeft>
          <AccountHeaderCenter className="col-4">
            {userUnits ? <h1>{userData.name}</h1> : allyCodeForm}
          </AccountHeaderCenter>
          <AccountHeaderRight className="col-4">
            <table>
              <tbody>
                <tr>
                  <td>Ally Code: </td>
                  <td>{userData ? userData.ally_code : ''}</td>
                </tr>
                <tr>
                  <td>Last Updated: </td>
                  <td>{userData ? new Date(userData.last_updated).toLocaleString() : ''}</td>
                </tr>
                <tr>
                  <td>Patreon: </td>
                  <td>{togglePatreonButton}</td>
                </tr>
              </tbody>
            </table>
            <AccountButtons
              user={props.user}
              key="accountButtons"
              timeoutCompletionDate={timeoutCompletionDate}
              haveUserUnits={!!userUnits}
              refreshPlayerData={refreshPlayerData}
              clearAllyCode={clearAllyCode}
              isRefreshDisabled={isRefreshDisabled}
              enableRefreshButtons={enableRefreshButtons}
              disableRefreshButtons={disableRefreshButtons}
            />
          </AccountHeaderRight>
        </AccountHeader>

        {userUnits
          ? <CharacterTable
            userUnits={userUnits}
            />
          : ''
        }
      </AccountWrapper>
    </ContainerColumn>
  );
}