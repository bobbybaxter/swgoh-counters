export default function unlinkPatreonAccount() {
  this.patch( '/firebase/:id', ( schema, request ) => ( {
    ...schema.players.find( request.params.id ),
    accessToken: '',
    expiresIn: '',
    patreonId: '',
    refreshToken: '',
  } ));
}
