const pino = require('pino');

module.exports = config => pino({
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: process.env.NODE_ENV !== 'production',
  timestamp: pino.stdTimeFunctions.isoTime,
  serializers: {
    req({ method, url, headers: { host } }) {
      return { method, url, host };
    },
    res(res) {
      const { statusCode } = res;
      return { statusCode };
    },
  },
});
