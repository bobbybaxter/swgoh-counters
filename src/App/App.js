/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable max-len */
import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import {
  BrowserRouter,
  // Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import ReactGA from 'react-ga';

import './App.scss';

import Counters3v3 from '../components/Counters3v3/Counters3v3';
import Counters5v5 from '../components/Counters5v5/Counters5v5';
import MyNavbar from '../components/MyNavbar/MyNavbar';
import NotFound from '../components/NotFound/NotFound';
// import Profile from '../components/Profile/Profile';
import SubmissionForm from '../components/SubmissionForm/SubmissionForm';

import characterData from '../helpers/data/characters.json';
import firebaseConnection from '../helpers/data/firebaseConnection';
import firebaseData from '../helpers/data/firebaseData';
import getCounterData from '../helpers/data/countersData';
import getSquadData from '../helpers/data/squadsData';

import buildOpponentTeam from '../helpers/buildOpponentTeam';
import buildSquad from '../helpers/buildSquad';

firebaseConnection();

// const PrivateRoute = ({ component: Component, authenticated, ...rest }) => {
//   const routeChecker = props => (authenticated === true
//     ? (<Component {...props} {...rest} />)
//     : (<Redirect to={{ pathname: '/auth', state: { from: props.location } }} />));
//   return <Route {...rest} render={props => routeChecker(props)} />;
// };

// const PublicRoute = ({ component: Component, authenticated, ...rest }) => {
//   const routeChecker = props => (authenticated === false
//     ? (<Component {...props} {...rest} />)
//     : (<Redirect to={{ pathname: '/5v5', state: { from: props.location } }} />));
//   return <Route {...rest} render={props => routeChecker(props)} />;
// };

const defaultUser = {
  id: '',
  allyCode: '',
  email: '',
  patreonId: '',
  patronStatus: '',
};

class App extends React.Component {
  state = {
    user: defaultUser,
    data: null,
    authenticated: false,
    characters: characterData.data,
    squads: [],
    countersNormal5v5: [],
    countersReverse5v5: [],
    countersNormal3v3: [],
    countersReverse3v3: [],
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

  buildSquadObjects = (res, squad, size, view) => {
    // get the correct counter info
    const counterInfo = res
      .filter(x => x.battleType === `${size}v${size}`)
      .filter(x => (view === 'normal'
        ? x.opponentTeam === squad.id
        : x.counterTeam === squad.id
      ));

    // get the left side squad
    const leftSideSquad = buildSquad(squad, size, this.state.characters);

    // get the right side squads
    const rightSideSquads = counterInfo
      .map(matchup => buildOpponentTeam(
        matchup, size, this.state.squads, this.state.characters, view,
      ));

    // put them into an object and push into state
    const squadObject = rightSideSquads.length ? { leftSideSquad, rightSideSquads } : '';
    return squadObject;
  }

  getCounters = async () => {
    await getCounterData()
      .then((res) => {
        // seems verbose, but it queues up all of the
        // counters at once before distributing to child components
        const normal5 = [];
        const reverse5 = [];
        const normal3 = [];
        const reverse3 = [];
        this.state.squads.forEach((squad) => {
          normal5.push(this.buildSquadObjects(res, squad, 5, 'normal'));
          reverse5.push(this.buildSquadObjects(res, squad, 5, 'reverse'));
          normal3.push(this.buildSquadObjects(res, squad, 3, 'normal'));
          reverse3.push(this.buildSquadObjects(res, squad, 3, 'reverse'));
        });
        this.setState({ countersNormal5v5: normal5.filter(x => x !== '') });
        this.setState({ countersReverse5v5: reverse5.filter(x => x !== '') });
        this.setState({ countersNormal3v3: normal3.filter(x => x !== '') });
        this.setState({ countersReverse3v3: reverse3.filter(x => x !== '') });
      })
      .catch(err => console.error(err));
  };

  getSquads = async () => {
    await getSquadData()
      .then(res => this.setState({ squads: res }))
      .then(() => this.getCounters())
      .catch(err => console.error(err));
  };

  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged(this.authenticateUser);
    ReactGA.pageview(window.location.pathname);
    this.getSquads();
  }

  handleAllyCode = (e) => {
    const user = Object.assign({}, this.state.user);
    user.allyCode = e.target.value;
    this.setState({ user });
  };

  handleClearAllyCode = () => {
    const {
      id, allyCode, email, patreonId, patronStatus,
    } = this.state;
    const user = {
      id,
      allyCode,
      email,
      patreonId,
      patronStatus,
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
                        countersNormal={this.state.countersNormal5v5}
                        countersReverse={this.state.countersReverse5v5}
                      />
                    } />
                    <Route exact path="/3v3" render={props => <Counters3v3
                        {...props}
                        user={user}
                        countersNormal={this.state.countersNormal3v3}
                        countersReverse={this.state.countersReverse3v3}
                      />
                    } />
                    <Route exact path="/submit" component={ SubmissionForm } />
{/*
                    <PrivateRoute
                      exact path="/profile"
                      authenticated={authenticated}
                      component={Profile}
                      handleClearAllyCode={this.handleClearAllyCode}
                      handleAllyCode={this.handleAllyCode}
                      unlinkPatreonAccount={this.unlinkPatreonAccount}
                      user={user}
                    /> */}

                    <Route component={NotFound} />
                  </Switch>
              </div>
            </React.Fragment>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
