import './setup/wdyr';
import React from 'react';
import { hydrate, render } from 'react-dom';
import 'normalize.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.scss';
import ReactGA from 'react-ga';
import { AuthProvider } from './userContext';
import App from './App/App';
import * as serviceWorker from './serviceWorker';

ReactGA.initialize('UA-170978501-1');

const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) {
  hydrate(
      <AuthProvider>
        <App />
      </AuthProvider>,
      rootElement,
  );
} else {
  render(
      <AuthProvider>
        <App />
      </AuthProvider>,
      rootElement,
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
