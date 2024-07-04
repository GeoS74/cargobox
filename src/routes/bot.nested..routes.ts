import Router from 'koa-router';
import * as bot from '../controllers/bot.controller';

const router = new Router();

router.get(
  '/update',
  bot.startBot,
  bot.isRun,
  bot.update,
);
router.get(
  '/state',
  bot.startBot,
  bot.state,
);
router.get('/stop', bot.stopBot);

export default router;
