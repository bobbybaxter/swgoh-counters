import firebase from 'firebase/app';
import fbConfig from '../../.firebase.config.json';

const firebaseApp = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(fbConfig);
  }
};

export default firebaseApp;
