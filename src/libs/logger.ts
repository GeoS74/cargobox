import log4js from 'log4js';
import path from 'path';

log4js.configure({
  appenders: {
    out: {
      type: 'stdout',
    },
    app: {
      type: 'file',
      filename: path.join(__dirname, '../../log/logger'),
    },
    appChildProcess: {
      type: 'file',
      filename: path.join(__dirname, '../../log/logger_child_process'),
    },
  },
  categories: {
    default: {
      appenders: ['out', 'app'],
      level: 'all',
    },
    childProcess: {
      appenders: ['out', 'appChildProcess'],
      level: 'error',
    },
  },
});

export const logger: log4js.Logger = log4js.getLogger('default');
export const loggerChildProcess: log4js.Logger = log4js.getLogger('childProcess');
