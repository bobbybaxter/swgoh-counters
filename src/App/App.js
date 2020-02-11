import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import {
  BrowserRouter, Redirect, Route, Switch,
} from 'react-router-dom';
import ReactGA from 'react-ga';

import Auth from '../components/Auth/Auth';
import Counters3v3 from '../components/Counters3v3/Counters3v3';
import Counters5v5 from '../components/Counters5v5/Counters5v5';
import MyNavbar from '../components/MyNavbar/MyNavbar';
import Profile from '../components/Profile/Profile';

import firebaseConnection from '../helpers/data/firebaseConnection';
import swgohData from '../helpers/data/swgohData';
import userData from '../helpers/data/userData';

import './App.scss';

firebaseConnection();

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => {
  const routeChecker = props => (authenticated === true
    ? (<Component {...props} {...rest} />)
    : (<Redirect to={{ pathname: '/auth', state: { from: props.location } }} />));
  return <Route {...rest} render={props => routeChecker(props)} />;
};

const PublicRoute = ({ component: Component, authenticated, ...rest }) => {
  const routeChecker = props => (authenticated === false
    ? (<Component {...props} {...rest} />)
    : (<Redirect to={{ pathname: '/5v5', state: { from: props.location } }} />));
  return <Route {...rest} render={props => routeChecker(props)} />;
};

class App extends React.Component {
  state = {
    userModel: {
      id: '',
      allyCode: '',
      email: '',
      firebaseUid: '',
      username: '',
    },
    userInfo: {},
    authenticated: false,
  }

  authUser = (authUser) => {
    if (authUser) {
      this.setState({ authenticated: true });
      const fbUser = firebase.auth().currentUser;
      this.setState(prevState => ({
        userModel: { ...prevState.userModel, email: fbUser.email, firebaseUid: fbUser.uid },
      }));
      this.validateAccount(fbUser.uid);
      if (localStorage.getItem('userInfo')) {
        console.error('there is user info');
      }
    } else {
      this.setState({ authenticated: false });
    }
  }

  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged(this.authUser);
    ReactGA.pageview(window.location.pathname);
  }

  componentWillUnmount() {
    this.removeListener();
  }

  getSwgohData = (allyCode) => {
    swgohData.getUserData(allyCode)
      .then(res => this.setState({
        userInfo: res,
      }))
      .then(() => localStorage.setItem('userInfo', JSON.stringify(this.state.userInfo)))
      .catch(err => console.error(err));
  }

  setUserInfo = (res) => {
    this.setState(prevState => ({
      userModel: {
        ...prevState.userModel, id: res.id, allyCode: res.allyCode, username: res.username,
      },
    }));
  }

  submitAllyCode = (allyCode) => {
    swgohData.getUserData(allyCode)
      .then((res) => {
        const newUserModel = { allyCode: res.data.ally_code, username: res.data.name };
        return newUserModel;
      })
      .then((newUserModel) => {
        this.setState(prevState => ({
          userModel: {
            ...prevState.userModel,
            allyCode: newUserModel.allyCode,
            username: newUserModel.username,
          },
        }));
        userData.updateUserInfo(this.state.userModel);
      })
      .catch(err => console.error(err));
  }

  validateAccount = (firebaseUid) => {
    userData.getUserByFirebaseUid(firebaseUid)
      .then((res) => {
        if (res !== '') {
          this.setUserInfo(res);
        } else {
          userData.createUser().then((response) => {
            this.setUserInfo(response);
          });
          console.error('user created');
        }
      })
      .catch(err => console.error(err));
  }

  render() {
    const { authenticated, userModel } = this.state;
    return (
      <div className="App">
        <BrowserRouter>
            <React.Fragment>
              <MyNavbar authenticated={authenticated} />
              <div>
                  <Switch>
                    <Route exact path="/5v5" component={Counters5v5} authenticated={authenticated}/>
                    <Route exact path="/3v3" component={Counters3v3} authenticated={authenticated}/>

                    <PublicRoute path="/auth" component={Auth} authenticated={authenticated} />

                    <PrivateRoute
                      path="/profile"
                      component={Profile}
                      authenticated={authenticated}

                      handleInputChange={this.handleInputChange}
                      getSwgohData={this.getSwgohData}
                      submitAllyCode={this.submitAllyCode}
                      userModel={userModel}
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
