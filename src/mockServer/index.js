/* eslint-disable no-shadow */
import { createServer, Model } from 'miragejs';
import seed from './seed/seed';
import routes from './routes';

export default function mockServer() {
  const server = createServer( {
    models: {
      character: Model,
      guildInfo: Model,
      guild: Model,
      player: Model,
      stub: Model,
    },

    seeds( server ) { seed( server ); },

    routes() { routes.bind( this )(); },
  } );

  return server;
}
