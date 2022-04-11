import characterRoute from './character';
import counterRoute from './counter';
import firebaseRoute from './firebase';
import guildRoute from './guild';
import importRoute from './import';
import leaderRoute from './leader';
import patreonRoute from './patreon';
import playerRoute from './player';
import searchRoute from './search';
import squadRoute from './squad';
import swgohRoute from './swgoh';
import videoLinkRoute from './videoLink';

export default function routes() {
  /* EXTERNAL ROUTES */
  // Firebase
  this.passthrough( 'https://www.googleapis.com/**' );
  this.passthrough( 'https://securetoken.googleapis.com/**' );
  this.passthrough( 'https://play.google.com/**' );
  this.passthrough( 'https://accounts.google.com/**' );

  // SWGOH
  this.urlPrefix = 'https://api.allorigins.win/**';
  playerRoute.bind( this )();

  /* INTERNAL ROUTES */
  this.urlPrefix = `${ process.env.REACT_APP_API_URL }/api`;
  this.passthrough(); // Allow unhandled requests on the current domain to pass through

  characterRoute.bind( this )();
  counterRoute.bind( this )();
  firebaseRoute.bind( this )();
  guildRoute.bind( this )();
  importRoute.bind( this )();
  leaderRoute.bind( this )();
  patreonRoute.bind( this )();
  searchRoute.bind( this )();
  squadRoute.bind( this )();
  swgohRoute.bind( this )();
  videoLinkRoute.bind( this )();
}
