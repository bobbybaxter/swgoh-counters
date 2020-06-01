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
// import Profile from '../components/Profile/Profile';
import SubmissionForm from '../components/SubmissionForm/SubmissionForm';

import firebaseConnection from '../helpers/data/firebaseConnection';
import firebaseData from '../helpers/data/firebaseData';

import './App.scss';

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

class App extends React.Component {
  state = {
    user: {
      id: '',
      allyCode: '',
      email: '',
      firebaseUid: '',
    },
    data: null,
    authenticated: false,
  }

  authenticateUser = (authUser) => {
    if (authUser) {
      this.setState({ authenticated: true });
      const firebaseUser = firebase.auth().currentUser;
      this.setState(prevState => ({
        user: {
          ...prevState.user,
          email: firebaseUser.email,
          firebaseUid: firebaseUser.uid,
        },
      }));
      this.validateAccount(firebaseUser.uid);
    } else {
      this.setState({ authenticated: false });
    }
  }

  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged(this.authenticateUser);
    ReactGA.pageview(window.location.pathname);
  }

  setUserInfo = (res) => {
    this.setState(prevState => ({
      user: {
        ...prevState.user, id: res.id, allyCode: res.allyCode,
      },
    }));
  }

  validateAccount = (firebaseUid) => {
    firebaseData.getUserByFirebaseUid(firebaseUid)
      .then((res) => {
        if (res !== '') {
          return console.log('res has something :>> ', res);
          // this.setUserInfo(res);
        }
        return console.log('res has nothing :>> ', res);
        // firebaseData.createUser().then((response) => {
        //   this.setUserInfo(response);

        // console.error('user created');
      })
      .catch(err => console.error(err));
  }

  render() {
    const { authenticated } = this.state;
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

                    {/* <PublicRoute path="/auth" component={Auth} authenticated={authenticated} /> */}

                    {/* <PrivateRoute
                      path="/profile"
                      component={Profile}
                      authenticated={authenticated}
                      userModel={userModel}
                    /> */}

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
