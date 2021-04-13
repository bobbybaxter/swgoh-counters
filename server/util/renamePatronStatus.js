module.exports = (status) => {
  const statuses = {
    active_patron: 'Active Patron',
    declined_patron: 'Declined Patron',
    former_patron: 'Former Patron',
    null: 'Not a Patron',
  };
  return statuses[status] || statuses.null;
};
