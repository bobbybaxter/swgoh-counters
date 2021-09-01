module.exports = ( { data } ) => ( {
  method: 'GET',
  path: '/counter/variations',
  handler: async ( request, reply ) => {
    const { opponentLeaderId, counterLeaderId, size } = request.query;
    const response = await data.getVariations( [
      size,
      opponentLeaderId,
      counterLeaderId,
    ] );

    function sanitizeName( x ) {
      return x.replace( /-/g, ' ' ) // for Ki-Adi-Mundi
        .replace( /"/g, "'" ); // for Clones and Zeb
    }

    const variations = response.map( x => {
      const opponentSquad = JSON.parse( x.opponentSquad.replace( /CC-2224 "Cody"|CT-21-0408 "Echo"|CT-5555 "Fives"|CT-7567 "Rex"|"Zeb"|Ki-Adi-Mundi/g, name => sanitizeName( name )));
      const counterSquad = JSON.parse( x.counterSquad.replace( /CC-2224 "Cody"|CT-21-0408 "Echo"|CT-5555 "Fives"|CT-7567 "Rex"|"Zeb"|Ki-Adi-Mundi/g, name => sanitizeName( name )));
      return ( {
        ...x,
        opponentSquad,
        counterSquad,
      } );
    } );

    reply
      .type( 'application/json' )
      .send( variations );
  },
  schema: {
    query: {
      opponentLeaderId: { type: 'string' },
      counterLeaderId: { type: 'string' },
      size: { type: 'string' },
    },
    response: {
      '2xx': {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            totalSeen: { type: 'integer' },
            avgWin: { type: 'number' },
            opponentSquad: { type: 'array' },
            counterSquad: { type: 'array' },
          },
        },
      },
    },
  },
} );
