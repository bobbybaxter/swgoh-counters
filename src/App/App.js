import React from 'react';
import {
  BrowserRouter, Redirect, Switch,
} from 'react-router-dom';
import ReactGA from 'react-ga';

import MyNavbar from '../components/MyNavbar/MyNavbar';
import Counters5v5 from '../components/Counters5v5/Counters5v5';
import SubmissionForm from '../components/SubmissionForm/SubmissionForm';

import './App.scss';

class App extends React.Component {
  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
            <React.Fragment>
              <MyNavbar />
              <div>
                  <Switch>
                    <Counters5v5 path="/swgoh-counters" />
                    <SubmissionForm path="/submissionForm" />
                    {/* <Counters3v3 path="/counters3v3" /> */}
                    <Redirect from="*" to="/swgoh-counters" />
                  </Switch>
              </div>
            </React.Fragment>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
