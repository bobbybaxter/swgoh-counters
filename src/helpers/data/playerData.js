import { mockGetPlayerDataFromSwgoh } from './mockEndpoints';

export default async function getPlayerDataFromSwgoh( allyCode ) {
  // NOTE: mock
  return mockGetPlayerDataFromSwgoh();

  // NOTE: deprecated
  // const url = `https://api.allorigins.win/get?url=${ encodeURIComponent( `https://swgoh.gg/api/player/${ allyCode }` ) }`;
  // try {
  //   const response = await fetch( `${ url }` );

  //   if ( response.status === 404 ) {
  //     throw new Error( 'User does not exist.' );
  //   }

  //   return await response.json();
  // } catch ( err ) {
  //   console.error( 'getPlayerDataFromSwgoh Error', err );
  //   throw err;
  // }
}
