import React, {
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import 'firebase/auth';
import ReactGA from 'react-ga';
import _ from 'lodash';
import {
  BrowserRouter, Redirect, Route, Switch,
} from 'react-router-dom';
import MyNavbar from 'src/components/MyNavbar/MyNavbar';

import {
  firebaseConnection,
  getSquadData,
  getAllCharacters,
} from 'src/helpers/data';
import { AuthContext } from 'src/contexts/userContext';

import './App.scss';

const Account = lazy(() => import('src/components/Account/Account'));
const PatreonLink = lazy(() => import('src/components/PatreonLink/PatreonLink'));
const Login = lazy(() => import('src/components/Account/Login'));
const CountersPage = lazy(() => import('src/components/CountersPage/CountersPage'));
const NotFound = lazy(() => import('src/components/NotFound/NotFound'));
const SubmissionForm = lazy(() => import('src/components/SubmissionForm/SubmissionForm'));

firebaseConnection();

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { authenticated } = useContext(AuthContext);
  const routeChecker = props => (authenticated === true
    ? (<Component {...props} {...rest} />)
    : (<Redirect to={{ pathname: '/', state: { from: props.location } }} />));
  return <Route {...rest} render={props => routeChecker(props)} />;
};

const storedSquads = JSON.parse(sessionStorage.getItem('squads')) || [];
const storedCharacters = JSON.parse(sessionStorage.getItem('characters')) || [];

// TODO: do an addCounter and addSquad check on the server-side, to eliminate duplicates
// REVIEW: (might be deprecated with this PR)
//  remove any useEffects that request the squadmembers of leftSquadStub since
//  it's now that info is coming in the squadStub call
// TODO: add a way to lock any videos that i put on the site from being delete by other users
// TODO: possibly make my videos a different color, make the the first video shown
// TODO: figure out why the guild endpoint is getting called twice
// FIXME: remove access for adding/editing counters if allyCode is not submitted
function App() {
  const [characters, setCharacters] = useState([]);
  const [squads, setSquads] = useState([]); // eslint-disable-line no-unused-vars
  const [view, setView] = useState('normal');
  const { loading } = useContext(AuthContext);

  const reload = useCallback(() => window.location.reload(), []);

  useEffect(() => {
    async function getSquads() {
      const results = await getSquadData().catch(e => console.error('getAllSquads', e));
      if (results && !_.isEqual(results, storedSquads)) {
        setSquads(results);
        sessionStorage.setItem('squads', JSON.stringify(results));
      }
    }

    async function getCharacters() {
      const results = await getAllCharacters().catch(e => console.error('getAllCharacters', e));
      if (results && !_.isEqual(results, storedCharacters)) {
        setCharacters(results);
        return sessionStorage.setItem('characters', JSON.stringify(results));
      }
      if (!results && storedCharacters) {
        // if get all characters fails, this route will update the state
        // so the rest of the app may not fail if the user still has data
        // in session storage
        return setCharacters(storedCharacters);
      }
      return setCharacters(results);
    }

    ReactGA.pageview(window.location.pathname);
    try {
      getCharacters();
      getSquads();
    } catch (err) {
      throw err;
    }
  }, []);

  function handleViewBtn(e) {
    const viewToSet = view === 'normal' ? 'reverse' : 'normal';
    setView(viewToSet);
  }

  return (
    <div id="App" className="App">
      { !loading
        ? <BrowserRouter basename="/" hashType="slash">
          <React.Fragment>
            <MyNavbar />
            <div id="modal"></div>
            <div>
              <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                  <Route exact path="/" render={props => (
                    <CountersPage
                      {...props}
                      characters={characters}
                      handleViewBtn={handleViewBtn}
                      reload={reload}
                      size={'5v5'}
                      view={view}
                    />
                  )}/>

                  <Route exact path="/3v3" render={props => (
                    <CountersPage
                      {...props}
                      characters={characters}
                      handleViewBtn={handleViewBtn}
                      reload={reload}
                      size={'3v3'}
                      view={view}
                    />
                  )}/>

                  <Route exact path="/submit" component={ SubmissionForm } />

                  <Route exact path="/login" component={ Login } />

                  <Route exact path="/patreonLink" component={ PatreonLink } />

                  <PrivateRoute
                    exact path="/account"
                    component={Account}
                  />

                  <Route component={NotFound} />
                  <Redirect from="*" to="/" />
                </Switch>
              </Suspense>
            </div>
          </React.Fragment>
        </BrowserRouter>
        : <div>Loading...</div>
      }
    </div>
  );
}
export default App;
