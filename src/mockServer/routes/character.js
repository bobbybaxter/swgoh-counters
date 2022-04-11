export default function characterRoute() {
  this.get( '/character', require( 'src/mockServer/seed/characters.json' ));
}
