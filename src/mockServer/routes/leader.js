export default function leaderRoute() {
  this.post( '/leader', ( schema, request ) => ( {
    status: 'ok',
    squadId: JSON.parse( request.requestBody ),
  } ));

  this.delete( '/leader', () => 'ok' );

  this.get( '/leader', () => {} );
}
