import React, { useEffect, useState } from 'react';
import {
  Button, Form, FormGroup, Input,
} from 'reactstrap';
import MetaTags from 'react-meta-tags';
import PropTypes from 'prop-types';

import { getPlayerData, firebaseData } from 'src/helpers/data';
import { ContainerColumn } from 'src/styles/style';

import AccountButtons from './AccountButtons';
import {
  AccountHeader,
  AccountHeaderCenter,
  AccountHeaderLeft,
  AccountHeaderRight,
  AccountWrapper,
} from './style';

const userDataInStorage = JSON.parse(localStorage.getItem('userData'));

const patreonLink = `https://patreon.com/oauth2/authorize?response_type=code&client_id=${process.env.REACT_APP_PATREON_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_PATREON_REDIRECT}&scope=identity${encodeURI('[email]')}%20identity`;

export default function Account(props) {
  Account.propTypes = {
    authenticated: PropTypes.bool,
    handleClearAllyCode: PropTypes.func,
    handleAllyCode: PropTypes.func,
    unlinkPatreonAccount: PropTypes.func,
    user: PropTypes.object,
  };

  const [userData, setUserData] = useState(userDataInStorage || '');

  const setPlayerData = () => {
    getPlayerData(props.user.allyCode)
      .then((res) => {
        localStorage.setItem('userData', JSON.stringify(res.data));
        return setUserData(res.data);
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
    setUserData('');
    props.handleClearAllyCode();
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
            {userData && userData.name ? <h1>{userData.name}</h1> : allyCodeForm}
          </AccountHeaderCenter>
          <AccountHeaderRight className="col-4">
            <table>
              <tbody>
                <tr>
                  <td>Ally Code: </td>
                  <td>{userData ? userData.ally_code : ''}</td>
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
              clearAllyCode={clearAllyCode}
            />
          </AccountHeaderRight>
        </AccountHeader>
      </AccountWrapper>
    </ContainerColumn>
  );
}
