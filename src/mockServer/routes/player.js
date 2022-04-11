export default function playerRoute() {
  this.get( '/', () => ( {
    contents: JSON.stringify( require( 'src/mockServer/seed/playerData.json' )),
  } ));
}
