import Router from 'koa-router';
import { Context, Next } from 'koa';
import { IChildBot } from '_bot';
import * as bot from '../controllers/bot.controller';

const router = new Router({ prefix: '/api/cargobox/delline' });

let _bot: IChildBot;

router.use(async (ctx: Context, next: Next) => {
  _bot.name = 'Delline';
  ctx.bot = _bot;

  await next();
});

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

export default router.routes();
