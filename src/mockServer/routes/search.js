import allVariations from 'src/mockServer/seed/variations.json';

export default function searchRoute() {
  this.post( '/search/character', ( schema, request ) => {
    const { battleType, squadPosition, characterId } = JSON.parse( request.requestBody );
    const position = squadPosition === 'defense' ? 'opponent' : 'counter';
    return allVariations
      .filter( vari => vari.battleType === battleType )
      .filter( vari => vari[ `${ position }Squad` ].find( toon => toon.id === characterId ));
  } );

  this.post( '/search/counter', ( schema, request ) => {
    const { battleType, opponentSquad, counterSquad } = JSON.parse( request.requestBody );
    const opponentSquadIds = opponentSquad.filter( toon => toon.id !== 'BLANK' ).map( toon => toon.id );
    const counterSquadIds = counterSquad.filter( toon => toon.id !== 'BLANK' ).map( toon => toon.id );
    return allVariations
      .filter( vari => vari.battleType === battleType )
      .filter( vari => (
        vari.opponentLeaderId === opponentSquad[ 0 ].id
        && vari.counterLeaderId === counterSquad[ 0 ].id
      ))
      .filter( vari => {
        const opponentIds = vari.opponentSquad.map( y => y.id );
        const counterIds = vari.counterSquad.map( y => y.id );
        return opponentSquadIds.every( squadId => opponentIds.includes( squadId ))
          && counterSquadIds.every( squadId => counterIds.includes( squadId ));
      } );
  } );

  this.post( 'search/squad', ( schema, request ) => {
    const { battleType, squadPosition, squad } = JSON.parse( request.requestBody );
    const position = squadPosition === 'defense' ? 'opponent' : 'counter';
    const squadIds = squad.filter( toon => toon.id !== 'BLANK' ).map( toon => toon.id );
    return allVariations
      .filter( vari => vari.battleType === battleType )
      .filter( vari => vari[ `${ position }LeaderId` ] === squad[ 0 ].id )
      .filter( vari => {
        const variationCharacterIds = vari[ `${ position }Squad` ].map( x => x.id );
        return squadIds.every( squadId => variationCharacterIds.includes( squadId ));
      } );
  } );
}
