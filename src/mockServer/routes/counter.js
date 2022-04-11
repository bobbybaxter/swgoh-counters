import allVariations from 'src/mockServer/seed/variations.json';

export default function counterRoute() {
  this.delete( '/counter/:id', () => 'ok' );

  this.patch( '/counter/:id', () => 'ok' );

  this.get( '/counter/getStubsBySquadIds/:leaderId', ( schema, request ) => {
    const { leaderId } = request.params;
    const { view, size } = request.queryParams;
    const stubs = schema.stubs.find( `${ size }_${ view }_${ leaderId }` );
    return stubs ? stubs.attrs : [];
  } );

  this.get( '/counter/variations', ( schema, request ) => {
    const { counterLeaderId, opponentLeaderId, size } = request.queryParams;
    return allVariations.filter( x => x.id === `${ size }_${ opponentLeaderId }_${ counterLeaderId }` );
  } );
}
