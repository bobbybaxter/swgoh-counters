/* eslint-disable no-await-in-loop */
const axios = require( 'axios' );
const jsdom = require( 'jsdom' );

const { JSDOM } = jsdom;

module.exports = app => async season => {
  const baseURL = 'https://swgoh.gg/gac/counters';

  const swgohData = [];

  async function makeRequest( { seasonNum, page = 1 } ) {
    const response = await axios( {
      method: 'GET',
      baseURL,
      params: {
        season: seasonNum,
        page,
      },
    } );

    const { document } = ( new JSDOM( response.data )).window;
    return document;
  }

  async function checkPagination( document ) {
    const paginationDiv = document.querySelector( '.pagination' );
    let lastPage;
    if ( paginationDiv ) {
      const page = document.querySelector( '.pagination' ).children;
      Array.from( page ).forEach( item => {
        const trimmedItem = item.textContent.replace( /\s+/g, ' ' ).trim().split( ' ' );
        if ( trimmedItem.includes( 'Page' )) {
          lastPage = trimmedItem[ 3 ]; // eslint-disable-line prefer-destructuring
        }
      } );
    } else {
      lastPage = 1;
      console.info( 'single page' );
    }
    return lastPage;
  }

  async function parseDom( document ) {
    return Array.from( document.querySelectorAll( 'div.panel > .row' )).forEach(( panel, i ) => {
      const divElement = panel.children;

      divElement
        .item( 2 )
        .querySelectorAll( 'a' )
        .forEach( x => swgohData.push( x.href.split( '/' )[ 3 ] ));
    } );
  }

  async function getData( seasonNum ) {
    const firstResponse = await makeRequest( { seasonNum } );
    const lastPage = await checkPagination( firstResponse );

    for ( let i = 1; i <= lastPage; i += 1 ) {
      const document = await makeRequest( { seasonNum, page: i } );
      await parseDom( document );
      console.info( `Season ${ seasonNum } - page ${ i } parsed` );
    }
  }

  async function start() {
    try {
      await getData( season );
      return swgohData.sort();
    } catch ( err ) {
      console.error( err );
      throw err;
    }
  }

  return start();
};
