const { values } = require( 'lodash' );

module.exports = opts => {
  const modules = require( 'require-directory' )( module, { visit: m => m( opts ) } );
  return values( modules );
};
