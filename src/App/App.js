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

import firebaseConnection from '../helpers/data/firebaseConnection';

import './App.scss';

firebaseConnection();

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => {
  const routeChecker = props => (authenticated === true
    ? (<Component {...props} />)
    : (<Redirect to={{ pathname: '/auth', state: { from: props.location } }} />));
  return <Route {...rest} render={props => routeChecker(props)} />;
};

const PublicRoute = ({ component: Component, authenticated, ...rest }) => {
  const routeChecker = props => (authenticated === false
    ? (<Component {...props} />)
    : (<Redirect to={{ pathname: '/5v5', state: { from: props.location } }} />));
  return <Route {...rest} render={props => routeChecker(props)} />;
};

class App extends React.Component {
  state = {
    authenticated: false,
  }

  authUser = (user) => {
    if (user) {
      this.setState({ authenticated: true });
      console.error(firebase.auth().currentUser.email);
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

  render() {
    const { authenticated } = this.state;
    return (
      <div className="App">
        <BrowserRouter>
            <React.Fragment>
              <MyNavbar authenticated={authenticated} />
              <div>
                  <Switch>
                    <Route exact path="/5v5" component={Counters5v5} authenticated={authenticated}/>

                    <PublicRoute path="/auth" component={Auth} authenticated={authenticated} />

                    <PrivateRoute path="/3v3" component={Counters3v3} authenticated={authenticated}/>

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
