module.exports = ( { data } ) => ( {
  method: 'GET',
  path: '/leader',
  handler: async ( request, reply ) => {
    const leaders = await data.get();
    const n5v5 = leaders.filter( x => x.battleType === '5v5' && x.view === 'normal' );
    const n3v3 = leaders.filter( x => x.battleType === '3v3' && x.view === 'normal' );
    const r5v5 = leaders.filter( x => x.battleType === '5v5' && x.view === 'reverse' );
    const r3v3 = leaders.filter( x => x.battleType === '3v3' && x.view === 'reverse' );

    reply
      .type( 'application/json' )
      .send( {
        n5v5, n3v3, r5v5, r3v3,
      } );
  },
  schema: {
    response: {
      '2xx': {
        type: 'object',
        properties: {
          n5v5: { type: 'array' },
          n3v3: { type: 'array' },
          r5v5: { type: 'array' },
          r3v3: { type: 'array' },
        },
      },
    },
  },
} );
