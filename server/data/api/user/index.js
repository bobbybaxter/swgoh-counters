const requireDirectory = require('require-directory');

module.exports = app => requireDirectory(module, './user', {
  visitor(obj) {
    return obj(app);
  },
});
