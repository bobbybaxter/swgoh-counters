const pino = require('pino');

module.exports = config => pino({
  level: config.logging.level || 'info',
  prettyPrint: {
    colorize: config.logging.prettyPrint,
    ignore: 'pid,hostname,reqId',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  serializers: {
    req({ method, url }) {
      return `${method} ${url}`;
    },
    res(res) {
      const { statusCode } = res;
      return `statusCode: ${statusCode}`;
    },
  },
});
