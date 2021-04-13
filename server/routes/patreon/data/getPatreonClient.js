/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
Object.defineProperty(exports, '__esModule', {
  value: true,
});

const _extends = Object.assign
  || function objectAssign(target) {
    for (let i = 1; i < arguments.length; i++) {
      // eslint-disable-next-line prefer-rest-params
      const source = arguments[i];
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          // eslint-disable-next-line no-param-reassign
          target[key] = source[key];
        }
      }
    }
    return target;
  };

const _isomorphicFetch = require('patreon/examples/node_modules/isomorphic-fetch');

const _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

const _jsonapiDatastore = require('patreon/examples/node_modules/jsonapi-datastore/dist/jsonapi-datastore');

const _utils = require('patreon/dist/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = app => async (accessToken) => {
  let store = new _jsonapiDatastore.JsonApiDataStore();

  const makeRequest = ({ method, path }) => {
    // const normalizedRequest = (0, _utils.normalizeRequest)(requestSpec);
    // EDIT: fixed the url issue
    const encodedPath = encodeURI(path);
    const normalizedRequest = {
      url: `https://www.patreon.com/api/oauth2${encodedPath}`,
      method,
    };
    const { url } = normalizedRequest;
    const options = _extends({}, normalizedRequest, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': (0, _utils.userAgentString)(),
      },
      credentials: 'include',
    });
    let _response;

    return (0, _isomorphicFetch2.default)(url, options)
      .then((response) => {
        _response = response;
        return (0, _utils.checkStatus)(response);
      })
      .then(_utils.getJson)
      .then(rawJson => ({ store, rawJson, response: _response }))
      .catch(error => console.error(error.status, error.statusText, error.url));
  };

  makeRequest.getStore = () => store;

  makeRequest.setStore = (newStore) => {
    store = newStore;
  };

  return makeRequest;
};
