const getPatreonClient = require('./getPatreonClient');
const getMemberTier = require('./getMemberTier');

const renamePatronStatus = require('../../../util/renamePatronStatus');
const renameTier = require('../../../util/renameTier');

const getCreatorToken = require('../../firebase/data/getCreatorToken');

module.exports = app => async (accessToken) => {
  let patronStatus = '';
  let tier = '';
  let membership;

  const apiClient = await getPatreonClient(app)(accessToken);
  const memberInfo = await apiClient({
    method: 'GET',
    path: '/v2/identity?include=memberships&fields[member]=patron_status',
  });

  if (memberInfo && memberInfo.rawJson && memberInfo.rawJson.included) {
    membership = memberInfo.rawJson.included.find(x => x.type === 'member');
  } else {
    return {
      patronStatus: 'Not a Patron',
      tier: '',
    };
  }

  if (membership) {
    const creatorToken = await getCreatorToken(app)();

    const memberTier = await getMemberTier(app)({ creatorToken, membership });

    patronStatus = renamePatronStatus(membership.attributes.patron_status);
    tier = renameTier(memberTier.id);
    return { patronStatus, tier };
  }

  return { patronStatus, tier };
};
