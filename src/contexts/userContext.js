import React, { useCallback, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import _ from 'lodash';

import {
  createUser,
  getUserByFirebaseAuthUid,
  updateUserInfo,
} from 'src/helpers/data';

const defaultUser = {
  id: '',
  allyCode: '',
  email: '',
  patreonId: '',
  patronStatus: '',
  username: '',
};

export const AuthContext = React.createContext();

export function AuthProvider({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [isRestricted, setIsRestricted] = useState(true);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(defaultUser);

  const setUserInfo = useCallback((res) => {
    const currentUser = { ...user };
    const userToSet = {
      email: res.email || currentUser.email,
      allyCode: res.allyCode || currentUser.allyCode,
      id: res.id || currentUser.id,
      patreonId: res.patreonId || currentUser.patreonId,
      patronStatus: res.patronStatus || currentUser.patronStatus,
      username: res.username || currentUser.username,
    };
    setUser(userToSet);
  }, [user]);

  useEffect(() => {
    async function validateAccount(userToValidate) {
      try {
        const res = await getUserByFirebaseAuthUid(userToValidate.id);
        if (!_.isEmpty(res)) {
          setUserInfo(res);
          if (res.patronStatus === 'active_patron') {
            setIsRestricted(false);
          }
          return console.info(`Firebase user ${res.email} validated`);
        }
        console.info('No Firebase user found in DB');
        const newUser = await createUser(userToValidate);
        setUserInfo(newUser);
        return console.info('User created in Firebase');
      } catch (err) {
        throw err;
      }
    }

    async function authenticateUser(authUser) {
      if (authUser) {
        const fbUser = { id: authUser.uid, email: authUser.email };
        await validateAccount(fbUser);
        const result = firebase.auth().getRedirectResult();
        if (result.credential) {
          const token = result.user.getIdToken(true);
          sessionStorage.setItem('token', token);
        }
        setAuthenticated(true);
        setLoading(false);
      } else {
        setIsRestricted(true);
        setAuthenticated(false);
        setLoading(false);
      }
    }

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

  function handleClearAllyCode() {
    const {
      id, email, patreonId, patronStatus,
    } = user;
    const userToSet = {
      id,
      allyCode: '',
      email,
      patreonId,
      patronStatus,
      username: '',
    };
    setUser(userToSet);
    updateUserInfo(userToSet);
  }

  function handleLogout() {
    setUser(defaultUser);
  }

  function unlinkPatreonAccountFromUser() {
    const userToSet = {
      ...user,
      patreonId: '',
      patronStatus: '',
    };
    setUser(userToSet);
  }

  return (
    <AuthContext.Provider value={{
      authenticated,
      isRestricted,
      loading,
      user,
      handleAllyCode,
      handleClearAllyCode,
      handleLogout,
      setUserInfo,
      unlinkPatreonAccountFromUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
