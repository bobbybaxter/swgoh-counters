/* eslint-disable camelcase */
import React, { useCallback, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import _ from 'lodash';

import {
  createUser,
  deleteGuild,
  getGuildById,
  getPlayerData,
  getUserByFirebaseAuthUid,
  updateGuild,
  updateUserInfo,
} from 'src/helpers/data';

const defaultUser = {
  id: '',
  accessToken: '',
  allyCode: '',
  email: '',
  expiresIn: '',
  guildId: '',
  guildName: '',
  patreonId: '',
  patronStatus: '',
  refreshToken: '',
  tier: '',
  username: '',
};

export const AuthContext = React.createContext();

export function AuthProvider( { children } ) {
  const [ admin, setAdmin ] = useState( false );
  const [ authenticated, setAuthenticated ] = useState( false );
  const [ isActivePatron, setIsActivePatron ] = useState( false );
  const [ isGuildTierMember, setIsGuildTierMember ] = useState( false );
  const [ isRestricted, setIsRestricted ] = useState( true );
  const [ loading, setLoading ] = useState( true );
  const [ user, setUser ] = useState( defaultUser );

  const {
    id,
    accessToken,
    email,
    expiresIn,
    guildId,
    guildName,
    patreonId,
    patronStatus,
    refreshToken,
    tier,
  } = user;

  const setUserInfo = useCallback( res => {
    const currentUser = { ...user };
    const userToSet = {
      id: res.id || currentUser.id,
      accessToken: res.accessToken || currentUser.accessToken,
      allyCode: res.allyCode || currentUser.allyCode,
      email: res.email || currentUser.email,
      expiresIn: res.expiresIn || currentUser.expiresIn,
      guildId: res.guildId,
      guildName: res.guildName,
      patreonId: res.patreonId || currentUser.patreonId,
      patronStatus: res.patronStatus || currentUser.patronStatus,
      refreshToken: res.refreshToken || currentUser.refreshToken,
      tier: res.tier || currentUser.tier,
      username: res.username || currentUser.username,
    };
    setUser( userToSet );
  }, [ user ] );

  const setPlayerData = useCallback( async playerAllyCode => {
    try {
      const response = await getPlayerData( playerAllyCode );
      const res = JSON.parse( response.contents );
      if ( res.data ) {
        const {
          ally_code, guild_id, guild_name, name,
        } = res.data;

        setUserInfo( {
          allyCode: ally_code.toString(),
          guildId: guild_id.toString() || '',
          guildName: guild_name || '',
          username: name,
        } );
        return res.data;
      }
      return '';
    } catch ( err ) {
      return console.error( 'setPlayerData error', err );
    }
  }, [ setUserInfo ] );

  const handleRemoveGuild = ( {
    firebaseUserId,
    guild,
  } ) => {
    const updatedGuildTierUsers = guild.guildTierUsers.filter( x => x !== firebaseUserId );
    // if there are no guildTierUsers after removal, delete guild record
    if ( _.isEmpty( updatedGuildTierUsers )) {
      deleteGuild( guild.id );
      return {};
    }
    // if there are guildTierUsers after removal, just update record
    const guildToUpdate = {
      ...guild,
      guildTierUsers: updatedGuildTierUsers,
    };
    updateGuild( guildToUpdate );
    return guildToUpdate;
  };

  const validateAccount = useCallback( async userToValidate => {
    const response = await getUserByFirebaseAuthUid( userToValidate.id );
    if ( response && !_.isEmpty( response.firebaseUser )) {
      const { guildData, firebaseUser } = response;
      const { isCurrentGuildInFirebase, isNowGuildTier } = guildData;

      // gives access if this is an active_patron
      if ( firebaseUser.patronStatus === 'active_patron' || firebaseUser.patronStatus === 'Active Patron' ) {
        setIsActivePatron( true );
        setIsRestricted( false );
      }

      if ( isCurrentGuildInFirebase || isNowGuildTier ) {
        setIsGuildTierMember( true );
        setIsRestricted( false );
      }

      setUserInfo( firebaseUser );
      return console.info( `Firebase user ${ firebaseUser.email } validated` );
    }
    console.info( 'No Firebase user found in DB' );
    const newUser = await createUser( userToValidate );
    setUserInfo( newUser );
    return console.info( 'User created in Firebase' );
  }, [ setUserInfo ] );

  const authenticateUser = useCallback( async authUser => {
    if ( authUser ) {
      const fbUser = { id: authUser.uid, email: authUser.email };
      await validateAccount( fbUser );

      setAdmin( fbUser.id === process.env.REACT_APP_ADMIN_ID );
      setAuthenticated( true );
      setLoading( false );
    } else {
      setAdmin( false );
      setIsRestricted( true );
      setAuthenticated( false );
      setLoading( false );
    }
  }, [ validateAccount ] );

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged( authUser => authenticateUser( authUser ));

    return () => {
      unsubscribe();
    };
  }, [] ); // eslint-disable-line react-hooks/exhaustive-deps

  function handleAllyCode( e ) {
    const userToSet = { ...user };
    userToSet.allyCode = e.target.value.split( '-' ).join( '' );
    setUser( userToSet );
  }

  async function handleClearAllyCode() {
    if ( guildId ) {
      const guild = await getGuildById( guildId ) || {};
      if ( !_.isEmpty( guild )) {
        await handleRemoveGuild( {
          guild,
          firebaseUserId: id,
          guildId,
          guildName,
        } );
      }
    }

    const userToSet = {
      id,
      accessToken,
      allyCode: '',
      email,
      expiresIn,
      guildId: '',
      guildName: '',
      patreonId,
      patronStatus,
      refreshToken,
      tier,
      username: '',
    };
    setUser( userToSet );
    setIsGuildTierMember( false );
    await updateUserInfo( userToSet );
  }

  function handleLogout() {
    setUser( defaultUser );
  }

  async function unlinkPatreonAccountFromUser() {
    if ( guildId ) {
      const guild = await getGuildById( guildId ) || {};
      if ( !_.isEmpty( guild )) {
        const remainingGuild = await handleRemoveGuild( {
          guild,
          firebaseUserId: id,
          guildId,
          guildName,
        } );

        if ( _.isEmpty( remainingGuild )) {
          setIsGuildTierMember( false );
        }
      }
    }

    const userToSet = {
      ...user,
      accessToken: '',
      expiresIn: '',
      refreshToken: '',
      patreonId: '',
      patronStatus: '',
      tier: '',
    };
    setUser( userToSet );
    setIsActivePatron( false );
  }

  return (
    <AuthContext.Provider value={{
      admin,
      authenticated,
      isActivePatron,
      isGuildTierMember,
      isRestricted,
      loading,
      user,
      authenticateUser,
      handleAllyCode,
      handleClearAllyCode,
      handleLogout,
      setPlayerData,
      setUserInfo,
      unlinkPatreonAccountFromUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
