export default function patreonRoute() {
  this.get( '/patreon/:accessToken', {
    patronStatus: 'Active Patron',
    tier: 'Aurodium',
  } );
}
