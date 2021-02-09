const pino = require('pino');

module.exports = config => pino({
  level: process.env.LOG_LEVEL || 'info',
  // prettyPrint: process.env.NODE_ENV === 'development'
  //   ? {
  //     colorize: true,
  //   }
  //   : false,
  prettyPrint: {
    colorize: process.env.NODE_ENV !== 'production',
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
