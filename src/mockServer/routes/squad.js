/* eslint-disable import/no-dynamic-require */
export default function squadoute() {
  this.patch( '/squad/:id', () => 'ok' );

  this.get( '/squad/stubs/:size', ( schema, request ) => require( `src/mockServer/seed/squadStubs${ request.params.size }.json` ));
}
