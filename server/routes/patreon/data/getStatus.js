const getPatreonClient = require('./getPatreonClient');
const getMemberTier = require('./getMemberTier');

const renamePatronStatus = require('../../../util/renamePatronStatus');
const renameTier = require('../../../util/renameTier');

const getCreatorToken = require('../../firebase/data/getCreatorToken');

module.exports = app => async (accessToken) => {
  let patronStatus = '';
  let tier = '';

  const apiClient = await getPatreonClient()(accessToken);
  const memberInfo = await apiClient({
    method: 'GET',
    path: '/v2/identity?include=memberships&fields[member]=patron_status',
  });

  const membership = memberInfo.rawJson.included.find(x => x.type === 'member');

  if (membership) {
    const creatorToken = await getCreatorToken(app)();
    const memberTier = await getMemberTier()({ creatorToken, membership });

    patronStatus = renamePatronStatus(membership.attributes.patron_status);
    tier = renameTier(memberTier.id);
    return { patronStatus, tier };
  }

  return { patronStatus, tier };
};
