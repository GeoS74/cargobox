import Router from 'koa-router';
import { Context, Next } from 'koa';
import * as kladr from '../controllers/kladr.controller';
import * as bot from '../middleware/bot.checked';

const router = new Router({ prefix: '/api/cargobox/delline' });

router.get(
  '/update',
  async (ctx: Context, next: Next) => {
    const botName: botName = 'Delline';
    ctx.botName = botName;
    await next();
  },
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
