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
  getAllCharacters,
} from 'src/helpers/data';
import { AuthContext } from 'src/contexts/userContext';
import './App.scss';

const Account = lazy(() => import( 'src/components/Account/Account' ));
const Admin = lazy(() => import( 'src/components/Account/Admin' ));
const CountersPage = lazy(() => import( 'src/components/CountersPage/CountersPage' ));
const Login = lazy(() => import( 'src/components/Account/Login' ));
// const Maintenance = lazy(() => import( 'src/components/Maintenance/Maintenance' ));
const NotFound = lazy(() => import( 'src/components/NotFound/NotFound' ));
const PatreonLink = lazy(() => import( 'src/components/PatreonLink/PatreonLink' ));

firebaseConnection();

const PrivateRoute = ( { component: Component, ...rest } ) => {
  const { authenticated } = useContext( AuthContext );
  const routeChecker = props => ( authenticated === true
    ? ( <Component {...props} {...rest} /> )
    : ( <Redirect to={{ pathname: '/', state: { from: props.location } }} /> ));
  return <Route {...rest} render={props => routeChecker( props )} />;
};

const AdminRoute = ( { component: Component, ...rest } ) => {
  const { admin } = useContext( AuthContext );
  const routeChecker = props => ( admin === true
    ? ( <Component {...props} {...rest} /> )
    : ( <Redirect to={{ pathname: '/', state: { from: props.location } }} /> ));
    // : ( <Redirect to={{ pathname: '/maintenance', state: { from: props.location } }} /> ));
  return <Route {...rest} render={props => routeChecker( props )} />;
};

const storedCharacters = JSON.parse( sessionStorage.getItem( 'characters' )) || [];

// TODO: go through endpoints to find unused endpoints
// TODO: disconnect the calculation of counterStats from SQL queries (elasticache?)
// TODO: update algorithm to account for nerfs due to GLs
// TODO: load up site with saved Patreon stuff, then lazy load Patron status
function App() {
  const [ characters, setCharacters ] = useState( [] );
  const [ view, setView ] = useState( 'normal' );
  const { loading } = useContext( AuthContext );

  const reload = useCallback(() => window.location.reload(), [] );

  useEffect(() => {
    sessionStorage.removeItem( 'squads' );

    // TODO: cache this call with redis
    async function getCharacters() {
      const results = await getAllCharacters().catch( e => console.error( 'getAllCharacters', e ));
      if ( results && !_.isEqual( results, storedCharacters )) {
        setCharacters( results );
        return sessionStorage.setItem( 'characters', JSON.stringify( results ));
      }
      if ( !results && storedCharacters ) {
        // if get all characters fails, this route will update the state
        // so the rest of the app may not fail if the user still has data
        // in session storage
        return setCharacters( storedCharacters );
      }
      return setCharacters( results );
    }

    ReactGA.pageview( window.location.pathname );
    getCharacters();
  }, [] );

  function handleViewBtn( e ) {
    const viewToSet = view === 'normal' ? 'reverse' : 'normal';
    setView( viewToSet );
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
                  {/* <AdminRoute exact path="/"
                      component={CountersPage}
                      characters={characters}
                      handleViewBtn={handleViewBtn}
                      reload={reload}
                      size={'5v5'}
                      view={view}
                  /> */}

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
                  {/* <AdminRoute exact path="/3v3"
                    component={CountersPage}
                    characters={characters}
                    handleViewBtn={handleViewBtn}
                    reload={reload}
                    size={'3v3'}
                    view={view}
                  /> */}

                  <Route exact path="/login" component={ Login } />

                  <Route exact path="/patreonLink" component={ PatreonLink } />

                  <PrivateRoute
                    exact path="/account"
                    component={ Account }
                  />

                  <AdminRoute
                    exact path="/admin"
                    component={ Admin }
                  />

                  {/* <Route exact path="/maintenance" component={ Maintenance } /> */}

                  <Route component={ NotFound } />
                  <Redirect from="*" to="/" />
                  {/* <Redirect from="*" to="/maintenance" /> */}
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
