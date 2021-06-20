module.exports = ({ firebaseDb }) => async ({ season, seasonRoster }) => {
  if (season) {
    firebaseDb.ref(`leadersBySeason/${season}`).set(JSON.stringify(seasonRoster));
  }
  return 'ok';
};
