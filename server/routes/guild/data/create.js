module.exports = ({ firebaseDb }) => async ({ id, name, guildTierUsers }) => {
  firebaseDb.ref(`guilds/${id}`).set({
    name,
    guildTierUsers,
  });
  return { id, name, guildTierUsers };
};
