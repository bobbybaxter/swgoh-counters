import React from 'react';
// import ReactDOM from 'react-dom';
import { hydrate, render } from 'react-dom';
import 'normalize.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/index.scss';
import ReactGA from 'react-ga';
import App from './App/App';
import * as serviceWorker from './serviceWorker';


ReactGA.initialize('UA-170978501-1');

// ReactDOM.render(<App />, document.getElementById('root'));
const rootElement = document.getElementById('root');
if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
