/* eslint-disable camelcase */
import React, { useCallback, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import _ from 'lodash';

import {
  createGuild,
  createUser,
  deleteGuild,
  getGuildById,
  getPatreonStatus,
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

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [isActivePatron, setIsActivePatron] = useState(false);
  const [isGuildTierMember, setIsGuildTierMember] = useState(false);
  const [isRestricted, setIsRestricted] = useState(true);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(defaultUser);

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
  const memberTiers = ['', 'Carbonite', 'Bronzium', 'Chromium'];
  const guildTiers = ['Aurodium'];

  const setUserInfo = useCallback((res) => {
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
    setUser(userToSet);
  }, [user]);

  const setPlayerData = useCallback(async (playerAllyCode) => {
    try {
      const response = await getPlayerData(playerAllyCode);
      const res = JSON.parse(response.contents);
      if (res.data) {
        const {
          ally_code, guild_id, guild_name, name,
        } = res.data;

        setUserInfo({
          allyCode: ally_code.toString(),
          guildId: guild_id.toString() || '',
          guildName: guild_name || '',
          username: name,
        });
        return res.data;
      }
      return '';
    } catch (err) {
      return console.error('setPlayerData error', err);
    }
  }, [setUserInfo]);

  const handleAddGuild = ({
    firebaseUserId,
    guild,
    guildIdFromSWGOHGG,
    guildNameFromSWGOHGG,
  }) => {
    // add new guild to guild list
    if (_.isEmpty(guild)) {
      const guildToCreate = {
        id: guildIdFromSWGOHGG,
        name: guildNameFromSWGOHGG,
        guildTierUsers: firebaseUserId,
      };
      createGuild(guildToCreate);
    }

    // add user to guild list
    if (!_.isEmpty(guild) && !guild.guildTierUsers.includes(firebaseUserId)) {
      guild.guildTierUsers.push(firebaseUserId);
      updateGuild(guild);
    }
  };

  const handleRemoveGuild = ({
    firebaseUserId,
    guild,
  }) => {
    const updatedGuildTierUsers = guild.guildTierUsers.filter(x => x !== firebaseUserId);
    // if there are no guildTierUsers after removal, delete guild record
    if (_.isEmpty(updatedGuildTierUsers)) {
      deleteGuild(guild.id);
      return {};
    }
    // if there are guildTierUsers after removal, just update record
    const guildToUpdate = {
      ...guild,
      guildTierUsers: updatedGuildTierUsers,
    };
    updateGuild(guildToUpdate);
    return guildToUpdate;
  };

  const validateAccount = useCallback(async (userToValidate) => {
    let patronStatusFromPatreon = '';
    let tierFromPatreon = '';
    let guildIdFromSWGOHGG = '';
    let guildNameFromSWGOHGG = '';
    try {
      const firebaseUser = await getUserByFirebaseAuthUid(userToValidate.id);
      if (!_.isEmpty(firebaseUser)) {
        if (firebaseUser.allyCode) {
          const swgohInfo = await setPlayerData(firebaseUser.allyCode);
          guildIdFromSWGOHGG = swgohInfo && swgohInfo.guild_id ? swgohInfo.guild_id.toString() : '';
          guildNameFromSWGOHGG = swgohInfo && swgohInfo.guild_name ? swgohInfo.guild_name : '';
        }

        // check Patreon status
        if (firebaseUser.accessToken) {
          const patreonInfo = await getPatreonStatus(firebaseUser.accessToken);
          patronStatusFromPatreon = patreonInfo.patronStatus;
          tierFromPatreon = patreonInfo.tier;
        }

        const oldGuild = firebaseUser.guildId ? await getGuildById(firebaseUser.guildId) : {};
        const guild = guildIdFromSWGOHGG ? await getGuildById(guildIdFromSWGOHGG) : {};

        const isNowGuildTier = guildTiers.includes(tierFromPatreon);
        const isNowMemberTier = memberTiers.includes(tierFromPatreon);
        const wasGuildTier = guildTiers.includes(firebaseUser.tier);
        const wasMemberTier = memberTiers.includes(firebaseUser.tier);
        const guildHasChanged = firebaseUser.guildId !== guildIdFromSWGOHGG;
        const patreonTierHasChanged = firebaseUser.tier !== tierFromPatreon;

        if ((wasGuildTier || isNowGuildTier) && guildHasChanged) {
          // if oldGuild, remove id from old guild
          if (!_.isEmpty(oldGuild)) {
            await handleRemoveGuild({
              guild: oldGuild,
              firebaseUserId: firebaseUser.id,
            });
          }

          // if newGuild, add id to newGuild
          if (!_.isEmpty(guild)) {
            await handleAddGuild({
              guild,
              firebaseUserId: firebaseUser.id,
              guildIdFromSWGOHGG,
              guildNameFromSWGOHGG,
            });
          }
        }

        // if Patreon tier changes
        if (patreonTierHasChanged) {
          const needToAddGuildLevel = wasMemberTier && isNowGuildTier;
          const needToRemoveGuildLevel = wasGuildTier && isNowMemberTier;

          const guildInfo = {
            guild,
            firebaseUserId: firebaseUser.id,
            guildIdFromSWGOHGG,
            guildNameFromSWGOHGG,
          };

          if (needToAddGuildLevel) {
            await handleAddGuild(guildInfo);
          }

          if (needToRemoveGuildLevel && !_.isEmpty(guild)) {
            await handleRemoveGuild(guildInfo);
          }
        }

        if (isNowGuildTier && guildIdFromSWGOHGG && _.isEmpty(guild)) {
          await handleAddGuild({
            guild,
            firebaseUserId: firebaseUser.id,
            guildIdFromSWGOHGG,
            guildNameFromSWGOHGG,
          });
        }

        const userToUpdate = {
          id: firebaseUser.id,
          accessToken: firebaseUser.accessToken || '',
          allyCode: firebaseUser.allyCode || '',
          email: firebaseUser.email || '',
          expiresIn: firebaseUser.expiresIn || '',
          guildId: guildIdFromSWGOHGG || '',
          guildName: guildNameFromSWGOHGG || '',
          patreonId: firebaseUser.patreonId || '',
          patronStatus: patronStatusFromPatreon || '',
          refreshToken: firebaseUser.refreshToken || '',
          tier: tierFromPatreon || '',
          username: firebaseUser.username || '',
        };
        await updateUserInfo(userToUpdate);

        // gives access if this is an active_patron
        if (patronStatusFromPatreon === 'active_patron' || patronStatusFromPatreon === 'Active Patron') {
          setIsActivePatron(true);
          setIsRestricted(false);
        }

        if (!_.isEmpty(guild) || isNowGuildTier) {
          setIsGuildTierMember(true);
          setIsRestricted(false);
        }

        setUserInfo(userToUpdate);
        return console.info(`Firebase user ${firebaseUser.email} validated`);
      }
      console.info('No Firebase user found in DB');
      const newUser = await createUser(userToValidate);
      setUserInfo(newUser);
      return console.info('User created in Firebase');
    } catch (err) {
      throw err;
    }
  }, [guildTiers, memberTiers, setPlayerData, setUserInfo]);

  const authenticateUser = useCallback(async (authUser) => {
    if (authUser) {
      const fbUser = { id: authUser.uid, email: authUser.email };
      await validateAccount(fbUser);

      setAuthenticated(true);
      setLoading(false);
    } else {
      setIsRestricted(true);
      setAuthenticated(false);
      setLoading(false);
    }
  }, [validateAccount]);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(authUser => authenticateUser(authUser));

    return () => {
      unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleAllyCode(e) {
    const userToSet = Object.assign({}, user);
    userToSet.allyCode = e.target.value;
    setUser(userToSet);
  }

  async function handleClearAllyCode() {
    if (guildId) {
      const guild = await getGuildById(guildId) || {};
      if (!_.isEmpty(guild)) {
        await handleRemoveGuild({
          guild,
          firebaseUserId: id,
          guildId,
          guildName,
        });
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
    setUser(userToSet);
    setIsGuildTierMember(false);
    await updateUserInfo(userToSet);
  }

  function handleLogout() {
    setUser(defaultUser);
  }

  async function unlinkPatreonAccountFromUser() {
    if (guildId) {
      const guild = await getGuildById(guildId) || {};
      if (!_.isEmpty(guild)) {
        const remainingGuild = await handleRemoveGuild({
          guild,
          firebaseUserId: id,
          guildId,
          guildName,
        });

        if (_.isEmpty(remainingGuild)) {
          setIsGuildTierMember(false);
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
    setUser(userToSet);
    setIsActivePatron(false);
  }

  return (
    <AuthContext.Provider value={{
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
