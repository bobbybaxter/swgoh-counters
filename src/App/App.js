import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import {
  BrowserRouter, Redirect, Route, Switch,
} from 'react-router-dom';
import ReactGA from 'react-ga';

import MyNavbar from '../components/MyNavbar/MyNavbar';
import Counters3v3 from '../components/Counters3v3/Counters3v3';
import Counters5v5 from '../components/Counters5v5/Counters5v5';
import Profile from '../components/Profile/Profile';
import SubmissionForm from '../components/SubmissionForm/SubmissionForm';

import firebaseConnection from '../helpers/data/firebaseConnection';
import firebaseData from '../helpers/data/firebaseData';

import './App.scss';

firebaseConnection();

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => {
  const routeChecker = props => (authenticated === true
    ? (<Component {...props} {...rest} />)
    : (<Redirect to={{ pathname: '/auth', state: { from: props.location } }} />));
  return <Route {...rest} render={props => routeChecker(props)} />;
};

// const PublicRoute = ({ component: Component, authenticated, ...rest }) => {
//   const routeChecker = props => (authenticated === false
//     ? (<Component {...props} {...rest} />)
//     : (<Redirect to={{ pathname: '/5v5', state: { from: props.location } }} />));
//   return <Route {...rest} render={props => routeChecker(props)} />;
// };

class App extends React.Component {
  state = {
    user: {
      id: '',
      allyCode: '',
      email: '',
      isPatron: false,
    },
    data: null,
    authenticated: false,
  }

  authenticateUser = (authUser) => {
    if (authUser) {
      const user = { id: authUser.uid, email: authUser.email };
      this.validateAccount(user);
      this.setState({ authenticated: true });
    } else {
      this.setState({ authenticated: false });
    }
  }

  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged(this.authenticateUser);
    ReactGA.pageview(window.location.pathname);
  }

  handleAllyCode = (e) => {
    const user = Object.assign({}, this.state.user);
    user.allyCode = e.target.value;
    this.setState({ user });
  };

  setUserInfo = (res) => {
    this.setState(prevState => ({
      user: {
        ...prevState.user,
        email: res.email,
        allyCode: res.allyCode,
        id: res.id,
        isPatron: res.isPatron,
      },
    }));
  }

  validateAccount = (user) => {
    firebaseData.getUserByFirebaseAuthUid(user.id)
      .then((res) => {
        if (res !== '') {
          console.log('res :>> ', res);
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
              <MyNavbar authenticated={authenticated}/>
              <div>
                  <Switch>
                    <Route exact path="/5v5" component={ Counters5v5 }/>
                    <Route exact path="/3v3" component={ Counters3v3 }/>
                    <Route exact path="/submit" component={ SubmissionForm } />

                    <PrivateRoute
                      path="/profile"
                      authenticated={authenticated}
                      component={Profile}
                      handleAllyCode={this.handleAllyCode}
                      user={user}
                    />

                    <Redirect from="*" to="/5v5" />
                  </Switch>
              </div>
            </React.Fragment>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
