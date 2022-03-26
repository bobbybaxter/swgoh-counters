const requireDir = require( 'require-directory' );

module.exports = opts => requireDir( module, {
  visit: m => m( opts ),
} );
