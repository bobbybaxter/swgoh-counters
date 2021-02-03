/* eslint-disable camelcase */
import React, { useEffect } from 'react';
import {
  Button, Form, FormGroup, Input,
} from 'reactstrap';
import MetaTags from 'react-meta-tags';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import 'firebase/auth';

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

const patreonLink = `https://patreon.com/oauth2/authorize?response_type=code&client_id=${process.env.REACT_APP_PATREON_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_PATREON_REDIRECT}&scope=identity${encodeURI('[email]')}%20identity`;

export default function Account({
  handleClearAllyCode,
  handleAllyCode,
  setUserInfo,
  unlinkPatreonAccount,
  user,
}) {
  Account.propTypes = {
    handleClearAllyCode: PropTypes.func,
    handleAllyCode: PropTypes.func,
    setUserInfo: PropTypes.func,
    unlinkPatreonAccount: PropTypes.func,
    user: PropTypes.object,
  };

  const setPlayerData = async () => {
    try {
      const res = await getPlayerData(user.allyCode);
      const { ally_code, name } = res.data;
      setUserInfo({ allyCode: ally_code.toString(), username: name });
      return res.data;
    } catch (err) {
      return console.error('setPlayerData error', err);
    }
  };

  useEffect(() => {
    // adds usernames to old accounts that don't currently have them
    async function updateUser() {
      if (user.allyCode && !user.username) {
        const userData = await setPlayerData();
        const userToUpdate = {
          id: user.id,
          allyCode: user.allyCode,
          email: user.email,
          patreonId: user.patreonId,
          patronStatus: user.patronStatus,
          username: userData.name,
        };
        await firebaseData.updateUserInfo(userToUpdate);
      }
    }

    updateUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearAllyCode = () => {
    handleClearAllyCode();
  };

  const submitAllyCode = async (e) => {
    e.preventDefault();
    try {
      const idToken = await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true);
      sessionStorage.setItem('token', idToken);
      await firebaseData.updateUserInfo(user);
    } catch (err) {
      console.error('Error submitting AllyCode: ', err);
    }
    setPlayerData();
  };

  const allyCodeForm = <Form inline className="justify-content-center">
    <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
      <Input
        type="text"
        name="allyCode"
        id="allyCode"
        placeholder="Ally Code"
        onChange={handleAllyCode}
      />
    </FormGroup>
    <Button type="submit" onClick={submitAllyCode}>Submit</Button>
  </Form>;

  const handleUnlinkPatreonAccount = () => {
    firebaseData.unlinkPatreonAccount(user);
    unlinkPatreonAccount();
  };

  const togglePatreonButton = !user.patreonId
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
            {user && user.username ? <h1>{user.username}</h1> : allyCodeForm}
          </AccountHeaderCenter>
          <AccountHeaderRight className="col-4">
            <table>
              <tbody>
                <tr>
                  <td>Ally Code: </td>
                  <td>{user && user.allyCode && user.username ? user.allyCode : ''}</td>
                </tr>
                <tr>
                  <td>Patreon: </td>
                  <td>{togglePatreonButton}</td>
                </tr>
              </tbody>
            </table>
            <AccountButtons
              user={user}
              key="accountButtons"
              clearAllyCode={clearAllyCode}
            />
          </AccountHeaderRight>
        </AccountHeader>
        <div className="alert alert-secondary">
          Want to add or update counters?
          <br/>
          Add your Ally Code above and link your Patreon account!
        </div>
      </AccountWrapper>
    </ContainerColumn>
  );
}
