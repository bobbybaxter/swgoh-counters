export default function flatten(obj) {
  return Object.keys(obj)
    .reduce((r, k) => r.concat(k, obj[k]), [])
    .pop();
}
