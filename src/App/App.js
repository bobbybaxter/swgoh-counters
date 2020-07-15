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

import addImageRefs from '../helpers/addImageRefs';

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
    squads: JSON.parse(sessionStorage.getItem('squads')) || [],
    countersNormal5v5: JSON.parse(sessionStorage.getItem('countersNormal5v5')) || [],
    countersReverse5v5: JSON.parse(sessionStorage.getItem('countersReverse5v5')) || [],
    countersNormal3v3: JSON.parse(sessionStorage.getItem('countersNormal3v3')) || [],
    countersReverse3v3: JSON.parse(sessionStorage.getItem('countersReverse3v3')) || [],
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

  getCounters = async () => {
    const counters = await getCounterData();
    const countersNormal5v5 = addImageRefs(counters.countersNormal5v5, this.state.characters);
    const countersReverse5v5 = addImageRefs(counters.countersReverse5v5, this.state.characters);
    const countersNormal3v3 = addImageRefs(counters.countersNormal3v3, this.state.characters);
    const countersReverse3v3 = addImageRefs(counters.countersReverse3v3, this.state.characters);
    this.setState({
      squads: counters.squads,
      countersNormal5v5,
      countersReverse5v5,
      countersNormal3v3,
      countersReverse3v3,
    });
    sessionStorage.setItem('squads', JSON.stringify(this.state.squads));
    sessionStorage.setItem('countersNormal5v5', JSON.stringify(this.state.countersNormal5v5));
    sessionStorage.setItem('countersReverse5v5', JSON.stringify(this.state.countersReverse5v5));
    sessionStorage.setItem('countersNormal3v3', JSON.stringify(this.state.countersNormal3v3));
    sessionStorage.setItem('countersReverse3v3', JSON.stringify(this.state.countersReverse3v3));
  };

  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged(this.authenticateUser);
    ReactGA.pageview(window.location.pathname);
    if (!sessionStorage.getItem('squads')) {
      this.getCounters();
    }
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
