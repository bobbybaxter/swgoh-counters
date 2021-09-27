const renamePatronStatus = require( 'util/renamePatronStatus' );
const renameTier = require( 'util/renameTier' );
const getCreatorToken = require( 'routes/firebase/data/getCreatorToken' );
const getPatreonClient = require( './getPatreonClient' );
const getMemberTier = require( './getMemberTier' );

module.exports = app => async accessToken => {
  let patronStatus = '';
  let tier = '';
  let membership, patreonEmail;

  const apiClient = await getPatreonClient( app )( accessToken );

  // REVIEW: takes 230.833ms to get memberInfo
  const memberInfo = await apiClient( {
    method: 'GET',
    path: '/v2/identity?include=memberships.campaign&fields[member]=patron_status,email&fields[campaign]=vanity&fields[user]=email,full_name',
  } );

  if ( memberInfo && memberInfo.rawJson && memberInfo.rawJson.included ) {
    membership = memberInfo.rawJson.included.find( x => x.type === 'member' );
    patreonEmail = memberInfo.rawJson.data.attributes.email;
  } else {
    return {
      patronStatus: 'Patreon info not found',
      tier: '',
    };
  }

  if ( membership ) {
    // REVIEW: takes 44.802ms to get creatorToken
    const creatorToken = await getCreatorToken( app )();

    // REVIEW: takes 258.873ms to get memberTier
    const memberTier = await getMemberTier( app )( { creatorToken, membership, patreonEmail } );

    if ( memberTier ) {
      patronStatus = renamePatronStatus( membership.attributes.patron_status );
      tier = renameTier( memberTier.id );
    }
  }

  return { patronStatus, tier };
};
