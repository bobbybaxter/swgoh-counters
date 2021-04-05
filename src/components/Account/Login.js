// Import FirebaseAuth and firebase.
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful.
  // Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/',
  // We will display Google and Facebook as auth providers.
  signInOptions: [{
    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  },
  {
    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    requireDisplayName: false,
  }],
};

function Login() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center mt-3">
      <p>Please sign-in:</p>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
}

export default Login;
