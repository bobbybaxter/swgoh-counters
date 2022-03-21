import React, { useCallback, useContext, useState } from 'react';
import {
  Button, Form, FormGroup, Input,
} from 'reactstrap';
import MetaTags from 'react-meta-tags';
import styled from 'styled-components';

import { unlinkPatreonAccount, updateUserInfo } from 'src/helpers/data';
import { ContainerColumn } from 'src/styles/style';
import { AuthContext } from 'src/contexts/userContext';

import {
  AccountWrapper,
} from './style';

const patreonLink = `https://patreon.com/oauth2/authorize?response_type=code&client_id=${ process.env.REACT_APP_PATREON_CLIENT_ID }&redirect_uri=${ process.env.REACT_APP_PATREON_REDIRECT }&scope=identity${ encodeURI( '[email]' ) }%20identity`;

const AccountDetails = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  font-size: .85rem;
`;

const AccountRowEven = styled( Form )`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  padding: .5rem;
  align-items: center;
  background-color: #181818;
`;

const AccountRowOdd = styled( Form )`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  padding: .5rem;
  align-items: center;
`;

const AccountCell = styled.div`
  padding: .5rem 0;
`;

const AccountButton = styled( Button )`
  font-size: .7rem;
  height: 50%;
  font-size: .7rem;
  text-align: center;
  padding: .25rem;

  @media only screen and (min-width:600px) {
   font-size: .75rem;
  }

  @media only screen and (min-width:768px) {
    font-size: 1rem;
  }
`;

const InputForm = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export default function Account() {
  const {
    handleClearAllyCode,
    handleClearDiscordId,
    handleAllyCode,
    isGuildTierMember,
    setPlayerData,
    unlinkPatreonAccountFromUser,
    user,
  } = useContext( AuthContext );

  const {
    id,
    accessToken,
    allyCode,
    discordId,
    email,
    expiresIn,
    guildId,
    guildName,
    patreonId,
    patronStatus,
    refreshToken,
    tier,
    username,
  } = user;

  const [ tempDiscordId, setTempDiscordId ] = useState( discordId );

  const updateUser = useCallback( async () => {
    const userData = await setPlayerData( allyCode );
    const selectGuildId = () => {
      if ( userData && userData.guild_Id ) { return userData.guild_id; }
      return guildId || '';
    };

    const selectGuildName = () => {
      if ( userData && userData.guild_name ) { return userData.guild_name; }
      return guildName || '';
    };

    const selectUsername = () => {
      if ( userData && userData.name ) { return userData.name; }
      return username || '';
    };

    const userToUpdate = {
      id,
      accessToken,
      allyCode,
      discordId,
      email,
      expiresIn,
      guildId: selectGuildId(),
      guildName: selectGuildName(),
      patreonId,
      patronStatus,
      refreshToken,
      tier,
      username: selectUsername(),
    };
    await updateUserInfo( userToUpdate );
    window.location.reload();
  }, [ accessToken, allyCode, discordId, email, expiresIn, guildId, guildName, id, patreonId, patronStatus, refreshToken, setPlayerData, tier, username ] ); // eslint-disable-line max-len

  function clearAllyCode() {
    handleClearAllyCode();
  }

  function clearDiscordId() {
    handleClearDiscordId();
  }

  function handleDiscordId( e ) {
    e.preventDefault();
    setTempDiscordId( e.target.value );
  }

  async function submitAllyCode( e ) {
    e.preventDefault();
    try {
      updateUser();
    } catch ( err ) {
      console.error( 'Error submitting AllyCode: ', err );
    }
  }

  async function submitDiscordId( e ) {
    e.preventDefault();
    try {
      const userToUpdate = {
        ...user,
        discordId: tempDiscordId,
      };
      await updateUserInfo( userToUpdate );
      window.location.reload();
    } catch ( err ) {
      console.error( 'Error submitting DiscordId: ', err );
    }
  }

  const allyCodeForm = <InputForm inline>
    <FormGroup className="mb-0 mr-1 w-100">
      <Input
        type="text"
        name="allyCode"
        id="allyCode"
        bsSize="sm"
        placeholder="Ally Code (NO DASHES)"
        className="w-100"
        onChange={handleAllyCode}
      />
    </FormGroup>
  </InputForm>;

  const discordIdForm = <InputForm inline>
    <FormGroup className="mb-0 mr-1 w-100">
      <Input
        type="text"
        name="discordId"
        id="discordId"
        bsSize="sm"
        placeholder="Paste Discord Id"
        className="w-100"
        onChange={handleDiscordId}
      />
    </FormGroup>
  </InputForm>;

  function handleUnlinkPatreonAccount() {
    unlinkPatreonAccount( user );
    unlinkPatreonAccountFromUser();
  }

  const togglePatreonButton = !patreonId || !patronStatus
    ? <AccountButton className="btn-sm w-100" href={patreonLink}>
          Link Patreon
        </AccountButton>
    : <AccountButton className="btn-sm w-100" onClick={handleUnlinkPatreonAccount}>
        Unlink Patreon
      </AccountButton>;

  const toggleAllyCodeButton = username
    ? <AccountButton
        className="btn-sm w-100"
        onClick={clearAllyCode}
      >Clear Ally Code</AccountButton>
    : <AccountButton className="btn-sm w-100" type="submit" onClick={submitAllyCode}>Submit</AccountButton>;

  const toggleDiscordIdButton = discordId
    ? <AccountButton
        className="btn-sm w-100"
        onClick={clearDiscordId}
      >Clear Discord Id</AccountButton>
    : <AccountButton className="btn-sm w-100" type="submit" onClick={submitDiscordId}>Submit</AccountButton>;

  return (
    <ContainerColumn className="Account">
      <MetaTags>
        <title>Account</title>
        <meta name="description" content="Link your SWGOH allycode and Patreon email"/>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </MetaTags>
      <AccountWrapper>
        <h3>Account Details</h3>
        <AccountDetails>
          <AccountRowEven className="text-left">
            <AccountCell className="col-3">Username: </AccountCell>
            <AccountCell className="col-6">{username || ''}</AccountCell>
            <AccountCell className="col-3"></AccountCell>
          </AccountRowEven>
          <AccountRowOdd className="text-left">
            <AccountCell className="col-3">Guild: </AccountCell>
            <AccountCell className="col-6">{guildName || ''}</AccountCell>
            <AccountCell className="col-3">{isGuildTierMember ? 'Patreon Guild Access' : ''}</AccountCell>
          </AccountRowOdd>
          <AccountRowEven className="text-left">
            <AccountCell className="col-3">Email: </AccountCell>
            <AccountCell className="col-6">{email || ''}</AccountCell>
            <AccountCell className="col-3"></AccountCell>
          </AccountRowEven>
          <AccountRowOdd className="text-left">
            <AccountCell className="col-3">Ally Code: </AccountCell>
            <AccountCell className="col-6">{allyCode && username ? allyCode : allyCodeForm}</AccountCell>
            <AccountCell className="col-3">{toggleAllyCodeButton}</AccountCell>
          </AccountRowOdd>
          <AccountRowEven className="text-left">
            <AccountCell className="col-3">Discord Id: </AccountCell>
            <AccountCell className="col-6">{discordId || discordIdForm}</AccountCell>
            <AccountCell className="col-3">{toggleDiscordIdButton}</AccountCell>
          </AccountRowEven>
          <AccountRowOdd className="text-left">
            <AccountCell className="col-3">Patreon: </AccountCell>
            <AccountCell className="col-6">{patreonId && patronStatus ? patronStatus : 'Not Linked'}</AccountCell>
            <AccountCell className="col-3">{togglePatreonButton}</AccountCell>
          </AccountRowOdd>
          {user.accessToken ? '' : <small className="alert alert-warning p-1 m-0">Patreon email must match {email || 'login email'}.  You may need to sign out of Patreon before trying to link, to ensure you are using the correct email address.</small>}
        </AccountDetails>
      </AccountWrapper>
    </ContainerColumn>
  );
}
