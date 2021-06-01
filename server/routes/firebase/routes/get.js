const _ = require('lodash');

const memberTiers = ['', 'Carbonite', 'Bronzium', 'Chromium'];
const guildTiers = ['Aurodium'];

const handleAddGuild = (data, {
  id,
  currentGuildInFirebase,
  guildIdFromSWGOHGG,
  guildNameFromSWGOHGG,
}) => {
  // add new guild to guild list
  if (_.isEmpty(currentGuildInFirebase)) {
    const guildToCreate = {
      id: guildIdFromSWGOHGG,
      name: guildNameFromSWGOHGG,
      guildTierUsers: id,
    };
    data.guild.create(guildToCreate);
  }

  // add user to guild list
  if (!_.isEmpty(currentGuildInFirebase)
    && !currentGuildInFirebase.guildTierUsers.includes(id)
  ) {
    currentGuildInFirebase.guildTierUsers.push(id);
    data.guild.update(currentGuildInFirebase);
  }
};

const handleRemoveGuild = (data, {
  id,
  oldGuildInFirebase,
}) => {
  const updatedGuildTierUsers = oldGuildInFirebase.guildTierUsers.filter(x => x !== id);
  // if there are no guildTierUsers after removal, delete guild record
  if (_.isEmpty(updatedGuildTierUsers)) {
    data.guild.delete(oldGuildInFirebase.id);
    return {};
  }
  // if there are guildTierUsers after removal, just update record
  const guildToUpdate = {
    ...oldGuildInFirebase,
    guildTierUsers: updatedGuildTierUsers,
  };
  data.guild.update(guildToUpdate);
  return guildToUpdate;
};

module.exports = ({ data, log }) => ({
  method: 'GET',
  path: '/firebase/:id',
  handler: async (request, reply) => {
    let accessToken,
      allyCode,
      expiresIn,
      guildIdFromSWGOHGG,
      guildNameFromSWGOHGG,
      patreonUser,
      refreshToken,
      swgohUser;

    try {
      reply.type('application/json');
      const user = await data.getByFirebaseUid(request.params.id);

      if (_.isEmpty(user) || !user) {
        return reply.send(user); // returns a null user so a new one can be created
      }

      const {
        guildId, id, tier,
      } = user;
      ({
        accessToken, allyCode, expiresIn, refreshToken,
      } = user);

      // patreon check
      if (accessToken) {
        try {
          const now = new Date();
          if (expiresIn && expiresIn < now.toISOString()) {
            const refreshedPatronToken = await data.patreon.getRefreshedToken(accessToken, refreshToken);
            accessToken = refreshedPatronToken.accessToken; // eslint-disable-line prefer-destructuring
            refreshToken = refreshedPatronToken.refreshToken; // eslint-disable-line prefer-destructuring
            expiresIn = refreshedPatronToken.expiresIn; // eslint-disable-line prefer-destructuring
          }

          patreonUser = await data.patreon.getStatus(accessToken);

          if (id === process.env.ADMIN_ID || process.env.VIP_IDS.split(',').includes(id)) {
            patreonUser = {
              patronStatus: 'Active Patron',
              tier: 'Aurodium',
            };
          }
        } catch (err) {
          log.error('getPatreonStatus error', err);
          patreonUser = {
            patronStatus: 'Patreon Not Responding',
            tier,
          };
        }
      }

      // guild check
      if (allyCode) {
        if (allyCode.includes('-')) {
          allyCode = allyCode.split('-').join('');
          user.allyCode = allyCode;
        }
        try {
          swgohUser = await data.getSwgohInfo(allyCode);
          guildIdFromSWGOHGG = swgohUser && swgohUser.guild_id ? swgohUser.guild_id.toString() : '';
          guildNameFromSWGOHGG = swgohUser && swgohUser.guild_name ? swgohUser.guild_name : '';
        } catch (err) {
          log.error('getSwgohInfo error', err);
          guildNameFromSWGOHGG = 'swgoh.gg Not Responding';
        }
      }

      const oldGuildInFirebase = guildId ? await data.guild.getByGuildId(guildId) : {};
      const currentGuildInFirebase = swgohUser
        ? await data.guild.getByGuildId(guildIdFromSWGOHGG)
        : {};

      const isNowGuildTier = patreonUser ? guildTiers.includes(patreonUser.tier) : false;
      const isNowMemberTier = patreonUser && memberTiers.includes(patreonUser.tier);
      const wasGuildTier = guildTiers.includes(tier);
      const wasMemberTier = memberTiers.includes(tier);
      const guildHasChanged = swgohUser ? guildId !== guildIdFromSWGOHGG : false;
      const patreonTierHasChanged = patreonUser ? tier !== patreonUser.tier : false;
      const oldGuildInfo = { id, oldGuildInFirebase };
      const currentGuildInfo = {
        id,
        currentGuildInFirebase,
        guildIdFromSWGOHGG,
        guildNameFromSWGOHGG,
      };

      if (guildHasChanged && (wasGuildTier || isNowGuildTier)) {
        // if oldGuild is in firebase, remove id from old guild in firebase
        if (!_.isEmpty(oldGuildInFirebase)) {
          await handleRemoveGuild(data, oldGuildInfo);
        }

        // if currentGuild is in firebse, add id to current guild in firebase
        if (!_.isEmpty(currentGuildInFirebase)) {
          await handleAddGuild(data, currentGuildInfo);
        }
      }

      // if Patreon tier changes
      if (patreonTierHasChanged) {
        if (wasMemberTier && isNowGuildTier) {
          await handleAddGuild(data, currentGuildInfo);
        }

        // REVIEW: do i need to add !_.isEmpty(currentGuildInFirebase)?
        if (wasGuildTier && isNowMemberTier) {
          await handleRemoveGuild(data, oldGuildInfo);
        }
      }

      if (isNowGuildTier && guildIdFromSWGOHGG && _.isEmpty(currentGuildInFirebase)) {
        await handleAddGuild(data, currentGuildInfo);
      }

      const updatedUser = {
        ...user,
        accessToken,
        expiresIn,
        refreshToken,
        guildId: guildIdFromSWGOHGG || '',
        guildName: guildNameFromSWGOHGG || '',
        patronStatus: patreonUser ? patreonUser.patronStatus : '',
        tier: patreonUser ? patreonUser.tier : '',
      };

      if (updatedUser !== user) {
        data.update(updatedUser);
      }

      const guildData = {
        isCurrentGuildInFirebase: !_.isEmpty(currentGuildInFirebase),
        isNowGuildTier,
      };

      return reply.send({ guildData, firebaseUser: updatedUser });
    } catch (err) {
      throw err;
    }
  },
  schema: {
    response: {
      '2xx': {
        type: 'object',
        properties: {
          guildData: {
            type: 'object',
            properties: {
              isCurrentGuildInFirebase: { type: 'boolean' },
              isNowGuildTier: { type: 'boolean' },
            },
          },
          firebaseUser: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              accessToken: { type: 'string' },
              allyCode: { type: 'string' },
              email: { type: 'string' },
              expiresIn: { type: 'string' },
              guildId: { type: 'string' },
              guildName: { type: 'string' },
              patreonId: { type: 'string' },
              patronStatus: { type: 'string' },
              refreshToken: { type: 'string' },
              tier: { type: 'string' },
              username: { type: 'string' },
            },
          },
        },
      },
    },
  },
});
