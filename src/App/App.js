import React, { Suspense, lazy } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import ReactGA from 'react-ga';
import _ from 'lodash';
import {
  BrowserRouter, Redirect, Route, Switch,
} from 'react-router-dom';
import MyNavbar from 'src/components/MyNavbar/MyNavbar';

import {
  firebaseConnection, firebaseData, getSquadData, getAllCharacters,
} from 'src/helpers/data';

import './App.scss';

const Account = lazy(() => import('src/components/Account/Account'));
const CountersPage = lazy(() => import('src/components/CountersPage/CountersPage'));
const NotFound = lazy(() => import('src/components/NotFound/NotFound'));
const SubmissionForm = lazy(() => import('src/components/SubmissionForm/SubmissionForm'));

firebaseConnection();

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => {
  const routeChecker = props => (authenticated === true
    ? (<Component {...props} {...rest} />)
    : (<Redirect to={{ pathname: '/', state: { from: props.location } }} />));
  return <Route {...rest} render={props => routeChecker(props)} />;
};

const defaultUser = {
  id: '',
  allyCode: '',
  email: '',
  patreonId: '',
  patronStatus: '',
  username: '',
};

const storedSquads = JSON.parse(sessionStorage.getItem('squads')) || [];
const storedCharacters = JSON.parse(sessionStorage.getItem('characters')) || [];

// TODO: in spreadsheet - replace all <br> tags in counters with \n
// TODO: create an FAQ in github and link in header
// TODO: delete Routes2 after pushed to Github, so i have an easy reference
// TODO: move the firebase refreshToken method to the beginning of the handleSubmitButton functions and pass the token to the requests
// TODO: do an addCounter and addSquad check on the server-side, to eliminate duplicates
// TODO: fix the bug on ModalAddSquad that errors and doesn't close the modal but adds the squads and doesn't add/update the counter
class App extends React.Component {
  state = {
    user: defaultUser,
    authenticated: false,
    characters: storedCharacters,
    squads: storedSquads,
    view: 'normal',
  }

  authenticateUser = (authUser) => {
    if (authUser) {
      const user = { id: authUser.uid, email: authUser.email };
      this.validateAccount(user);
      firebase.auth().getRedirectResult()
        .then((result) => {
          if (result.credential) {
            result.user.getIdToken(true)
              .then(token => sessionStorage.setItem('token', token));
          }
        });
      this.setState({ authenticated: true });
    } else {
      this.setState({ authenticated: false });
    }
  }

  getSquads = async () => {
    const results = await getSquadData().catch(e => console.error('getAllSquads', e));
    if (results && !_.isEqual(results, this.state.squads)) {
      this.setState({ squads: results });
      sessionStorage.setItem('squads', JSON.stringify(results));
    }
  }

  reload = () => window.location.reload();

  getCharacters = async () => {
    const results = await getAllCharacters().catch(e => console.error('getAllCharacters', e));
    if (results && !_.isEqual(results, this.state.characters)) {
      this.setState({ characters: results });
      sessionStorage.setItem('characters', JSON.stringify(results));
    }
    if (!results && this.state.characters) {
      // if get all characters fails, this route will update the state
      // so the rest of the app may not fail if the user still has data
      // in session storage
      this.setState({ characters: this.state.characters });
    }
  }

  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged(this.authenticateUser);
    ReactGA.pageview(window.location.pathname);
    this.getCharacters();
    this.getSquads();
  }

  handleAllyCode = (e) => {
    const user = Object.assign({}, this.state.user);
    user.allyCode = e.target.value;
    this.setState({ user });
  };

  handleClearAllyCode = () => {
    const {
      id, email, patreonId, patronStatus,
    } = this.state.user;
    const user = {
      id,
      allyCode: '',
      email,
      patreonId,
      patronStatus,
      username: '',
    };
    this.setState({ user });
    firebaseData.updateUserInfo(user);
  };

  handleLogout = () => {
    this.setState({ user: defaultUser });
  }

  handleViewBtn = () => {
    this.setState({ view: this.state.view === 'normal' ? 'reverse' : 'normal' });
  }

  setUserInfo = (res) => {
    this.setState(prevState => ({
      user: {
        email: res.email || prevState.user.email,
        allyCode: res.allyCode || prevState.user.allyCode,
        id: res.id || prevState.user.id,
        patreonId: res.patreonId || prevState.user.patreonId,
        patronStatus: res.patronStatus || prevState.user.patronStatus,
        username: res.username || prevState.user.username,
      },
    }));
  };

  unlinkPatreonAccount = () => {
    this.setState(prevState => ({
      user: {
        ...prevState.user,
        patreonId: '',
        patronStatus: '',
      },
    }));
  };

  validateAccount = (user) => {
    firebaseData.getUserByFirebaseAuthUid(user.id)
      .then((res) => {
        if (res !== '') {
          this.setUserInfo(res);
          return console.info(`Firebase user ${res.email} validated`);
        }
        console.info('No Firebase user found in DB');
        firebaseData.createUser(user)
          .then(response => this.setUserInfo(response));
        return console.info('User created in Firebase');
      })
      .catch(err => console.error(err));
  };

  render() {
    const { authenticated, user, view } = this.state;
    return (
      <div id="App" className="App">
        <BrowserRouter basename="/" hashType="slash">
            <React.Fragment>
              <MyNavbar
                authenticated={authenticated}
                handleLogout={this.handleLogout}
              />
              <div id="modal"></div>
              <div>
                  <Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                      <Route exact path="/" render={props => <CountersPage
                          {...props}
                          authenticated={authenticated}
                          handleViewBtn={this.handleViewBtn}
                          reload={this.reload}
                          size={'5v5'}
                          user={user}
                          view={view}
                        />}
                      />

                      <Route exact path="/3v3" render={props => <CountersPage
                          {...props}
                          authenticated={authenticated}
                          handleViewBtn={this.handleViewBtn}
                          reload={this.reload}
                          size={'3v3'}
                          user={user}
                          view={view}
                        />}
                      />

                      <Route exact path="/submit" component={ SubmissionForm } />


                      <PrivateRoute
                        exact path="/account"
                        authenticated={authenticated}
                        component={Account}
                        handleClearAllyCode={this.handleClearAllyCode}
                        handleAllyCode={this.handleAllyCode}
                        unlinkPatreonAccount={this.unlinkPatreonAccount}
                        setUserInfo={this.setUserInfo}
                        user={user}
                      />

                      <Route component={NotFound} />
                      <Redirect from="*" to="/" />
                    </Switch>
                  </Suspense>
              </div>
            </React.Fragment>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
