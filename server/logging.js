import * as winston from 'winston';
import * as path from 'path';

export const logger = new (winston.Logger);
const globalLoggingLevel = 'debug';

logger.add(winston.transports.Console, {
    colorize: true,
    level: globalLoggingLevel
});

logger.add(winston.transports.File, {
    level: globalLoggingLevel,
    timestamp: true,
    filename: path.resolve(__dirname, '../logs/log.txt'),
    maxsize: 10 * 1024 * 1024,
    maxFiles: 10,
    json: true
});
