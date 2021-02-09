/* eslint-disable import/no-dynamic-require */
export default function getImage(characterId) {
  return require(`../assets/characterImages/${characterId}.png`);
}
