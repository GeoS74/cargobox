import Router from 'koa-router';
import { Context, Next } from 'koa';
import { IChildBot } from '_bot';
import nested from './bot.nested..routes';

const router = new Router({ prefix: '/api/cargobox/delline' });

const _bot: IChildBot = {
  name: 'Delline',
  process: undefined,
};

// adding in context bot name and link for child process
router.use(async (ctx: Context, next: Next) => {
  ctx.bot = _bot;
  await next();
});
// nested routes for bot API
router.use(nested.routes());

export default router.routes();
