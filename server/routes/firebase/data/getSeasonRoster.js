module.exports = ({ firebaseDb }) => async (season) => {
  const roster = await firebaseDb
    .ref(`leadersBySeason/${season}`)
    .once('value')
    .then(snapshot => (snapshot.val()) || '{}');

  return JSON.parse(roster);
};
