import React from 'react';
import {
  HashRouter, Redirect, Route, Switch,
} from 'react-router-dom';
import ReactGA from 'react-ga';

import MyNavbar from '../components/MyNavbar/MyNavbar';
import Counters3v3 from '../components/Counters3v3/Counters3v3';
import Counters5v5 from '../components/Counters5v5/Counters5v5';
import Profile from '../components/Profile/Profile';

import './App.scss';

class App extends React.Component {
  state = {
    data: null,
  }

  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
  }

  render() {
    return (
      <div className="App">
        <HashRouter basename="/" hashType="slash">
            <React.Fragment>
              <MyNavbar />
              <div>
                  <Switch>
                    <Route exact path="/5v5" component={ Counters5v5 }/>
                    <Route exact path="/3v3" component={ Counters3v3 }/>
                    <Route exact path="/profile" component={ Profile }/>

                    <Redirect from="*" to="/5v5" />
                  </Switch>
              </div>
            </React.Fragment>
        </HashRouter>
      </div>
    );
  }
}

export default App;
