import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import ReactGA from 'react-ga';

import './App.scss';

import Counters3v3 from '../components/Counters3v3/Counters3v3';
import Counters5v5 from '../components/Counters5v5/Counters5v5';
import MyNavbar from '../components/MyNavbar/MyNavbar';
import NotFound from '../components/NotFound/NotFound';
import Account from '../components/Account/Account';
import SubmissionForm from '../components/SubmissionForm/SubmissionForm';

import firebaseConnection from '../helpers/data/firebaseConnection';
import firebaseData from '../helpers/data/firebaseData';
import { getSquadData, getSquadVersionDate } from '../helpers/data/squadsData';

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

const storedVersionDate = sessionStorage.getItem('squadVersionDate');
const storedSquads = JSON.parse(sessionStorage.getItem('squads')) || [];

class App extends React.Component {
  state = {
    user: defaultUser,
    data: null,
    authenticated: false,
    squadVersionDate: storedVersionDate,
    squads: storedSquads,
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
    const results = await getSquadData();
    this.setState({ squads: results });
    sessionStorage.setItem('squads', JSON.stringify(results));
  }

  async componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged(this.authenticateUser);
    ReactGA.pageview(window.location.pathname);

    const storedDate = sessionStorage.getItem('squadVersionDate');
    const { lastUpdate } = await getSquadVersionDate();

    if (!storedDate) {
      sessionStorage.setItem('squadVersionDate', lastUpdate);
      this.setState({ squadVersionDate: lastUpdate });
      this.getSquads();
    }

    if (storedDate && storedDate < lastUpdate) {
      sessionStorage.setItem('squadVersionDate', lastUpdate);
      this.setState({ squadVersionDate: lastUpdate });
      this.getSquads();
    }
  }

  handleAllyCode = (e) => {
    const user = Object.assign({}, this.state.user);
    user.allyCode = e.target.value;
    this.setState({ user });
  };

  handleClearAllyCode = () => {
    const {
      id, allyCode, email, patreonId, patronStatus, username,
    } = this.state;
    const user = {
      id,
      allyCode,
      email,
      patreonId,
      patronStatus,
      username,
    };
    this.setState({ user });
    firebaseData.updateUserInfo(user);
  };

  handleLogout = () => {
    this.setState({ user: defaultUser });
  }

  setUserInfo = (res) => {
    this.setState(prevState => ({
      user: {
        ...prevState.user,
        email: res.email,
        allyCode: res.allyCode,
        id: res.id,
        patreonId: res.patreonId,
        patronStatus: res.patronStatus,
        username: res.username,
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
          return console.log(`Firebase user ${res.email} validated`);
        }
        console.log('No Firebase user found in DB');
        firebaseData.createUser(user)
          .then(response => this.setUserInfo(response));
        return console.log('User created in Firebase');
      })
      .catch(err => console.error(err));
  };

  render() {
    const { authenticated, user } = this.state;
    return (
      <div className="App">
        <BrowserRouter basename="/" hashType="slash">
            <React.Fragment>
              <MyNavbar
                authenticated={authenticated}
                handleLogout={this.handleLogout}
              />
              <div>
                  <Switch>
                    <Route exact path="/" render={props => <Counters5v5
                        {...props}
                        user={user}
                      />}
                    />

                    <Route exact path="/3v3" render={props => <Counters3v3
                        {...props}
                        user={user}
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
                      user={user}
                    />

                    <Route component={NotFound} />
                    <Redirect from="*" to="/" />
                  </Switch>
              </div>
            </React.Fragment>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
