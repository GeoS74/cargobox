import Router from 'koa-router';
import * as kladr from '../controllers/kladr.controller';
import * as bot from '../middleware/bot.checked';

const router = new Router({ prefix: '/api/cargobox/kladr' });

router.get(
  '/update',
  kladr.startBot,
  bot.isRun,
  kladr.update,
);
router.get(
  '/state',
  kladr.startBot,
  kladr.state,
);
router.get('/stop', kladr.stopBot);

export default router.routes();
