import { logger } from './libs/logger';
import config from './config';
import app from './app';

app.listen(config.server.port, () => {
  logger.info(`server run http://${config.server.host}:${config.server.port}`);
})
  .on('error', (error) => {
    logger.error(error.message);
  });
