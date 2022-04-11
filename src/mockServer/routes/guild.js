export default function guildRoute() {
  this.post( '/guild', () => this.schema.guilds.find( 1 ));

  this.delete( '/guild/:id', () => 'ok' );

  this.get( '/guild/:id' );

  this.patch( '/guild', () => 'ok' );
}
