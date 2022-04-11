import './setup/wdyr';
import React from 'react';
import { hydrate, render } from 'react-dom';
import 'normalize.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.scss';
import ReactGA from 'react-ga';
import { AuthProvider } from 'src/contexts/userContext';
import { AccordionProvider } from 'src/contexts/accordionContext';
import mockServer from 'src/mockServer'; // NOTE: remove to allow for dev or prod environments
import App from './App/App';
import * as serviceWorker from './serviceWorker';

mockServer(); // NOTE: remove to allow for dev or prod environments

ReactGA.initialize( 'UA-170978501-1' );

const rootElement = document.getElementById( 'root' );
if ( rootElement.hasChildNodes()) {
  hydrate(
    <AuthProvider>
      <AccordionProvider>
        <App />
      </AccordionProvider>
    </AuthProvider>,
    rootElement,
  );
} else {
  render(
    <AuthProvider>
      <AccordionProvider>
        <App />
      </AccordionProvider>
    </AuthProvider>,
    rootElement,
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
