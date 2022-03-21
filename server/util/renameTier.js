module.exports = tierId => {
  const tiers = {
    4023873: 'Carbonite',
    4023966: 'Bronzium',
    4023977: 'Chromium',
    8436763: 'Aurodium', // new Aurodium tier
    4023982: 'Aurodium', // TODO: remove tier when tier is deleted
    4023995: 'Kyber',
    4024096: 'Power Converter',
  };
  return tiers[ tierId ];
};
