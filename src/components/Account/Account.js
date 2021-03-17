/* eslint-disable camelcase */
import React, { useCallback, useContext, useEffect } from 'react';
import {
  Button, Form, FormGroup, Input,
} from 'reactstrap';
import MetaTags from 'react-meta-tags';

import { getPlayerData, unlinkPatreonAccount, updateUserInfo } from 'src/helpers/data';
import { ContainerColumn } from 'src/styles/style';

import { AuthContext } from 'src/userContext';
import AccountButtons from './AccountButtons';
import {
  AccountHeader,
  AccountHeaderCenter,
  AccountHeaderLeft,
  AccountHeaderRight,
  AccountWrapper,
} from './style';

const patreonLink = `https://patreon.com/oauth2/authorize?response_type=code&client_id=${process.env.REACT_APP_PATREON_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_PATREON_REDIRECT}&scope=identity${encodeURI('[email]')}%20identity`;

export default function Account() {
  const {
    handleClearAllyCode,
    handleAllyCode,
    setUserInfo,
    unlinkPatreonAccountFromUser,
    user,
  } = useContext(AuthContext);

  const setPlayerData = useCallback(async () => {
    try {
      const response = await getPlayerData(user.allyCode);
      const res = JSON.parse(response.contents);
      const { ally_code, name } = res.data;
      setUserInfo({ allyCode: ally_code.toString(), username: name });
      return res.data;
    } catch (err) {
      return console.error('setPlayerData error', err);
    }
  }, [setUserInfo, user.allyCode]);

  const updateUser = useCallback(async () => {
    const userData = await setPlayerData();
    const userToUpdate = {
      id: user.id,
      allyCode: user.allyCode,
      email: user.email,
      patreonId: user.patreonId,
      patronStatus: user.patronStatus,
      username: userData.name,
    };
    await updateUserInfo(userToUpdate);
  }, [setPlayerData, user.allyCode, user.email, user.id, user.patreonId, user.patronStatus]);

  useEffect(() => {
    // adds usernames to old accounts that don't currently have them
    async function updateUserOnLoad() {
      if (user.allyCode && !user.username) {
        updateUser();
      }
    }

    updateUserOnLoad();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clearAllyCode = () => {
    handleClearAllyCode();
  };

  const submitAllyCode = async (e) => {
    e.preventDefault();
    try {
      updateUser();
    } catch (err) {
      console.error('Error submitting AllyCode: ', err);
    }
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
    unlinkPatreonAccount(user);
    unlinkPatreonAccountFromUser();
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
