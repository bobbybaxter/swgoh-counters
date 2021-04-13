const _ = require('lodash');

module.exports = ({ firebaseDb }) => async (guildId) => {
  const guild = await firebaseDb
    .ref(`guilds/${guildId}`)
    .once('value')
    .then(snapshot => (snapshot.val()) || {});
  if (!_.isEmpty(guild)) {
    guild.id = guildId;
  }
  return guild;
};
