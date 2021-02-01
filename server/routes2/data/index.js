const requireDirectory = require('require-directory');

module.exports = app => requireDirectory(module, './api', {
  visitor(obj) {
    return obj(app);
  },
});
