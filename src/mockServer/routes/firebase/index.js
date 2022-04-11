import firebase from 'firebase/app';
import 'firebase/database';
import createUser from './createUser';
import getUserByFirebaseAuthUid from './getUserByFirebaseAuthUid';
import updateUserInfo from './updateUserInfo';
import unlinkPatreonAccount from './unlinkPatreonAccount';
import firebaseConfig from '../../../setup/config/.firebase.config.json';

const app = firebase.initializeApp( firebaseConfig );
const db = firebase.database( app );

export default function firebaseRoute() {
  createUser.bind( this )( db );
  getUserByFirebaseAuthUid.bind( this )( db );
  updateUserInfo.bind( this )( db );
  unlinkPatreonAccount.bind( this )( db );
}
