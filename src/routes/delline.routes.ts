import Router from 'koa-router';
import { Context, Next } from 'koa';
import { IChildBot, IChildBotName } from '_bot';
import nested from './bot.nested..routes'

const router = new Router({ prefix: '/api/cargobox/delline' });

let _bot: IChildBot;

// adding in context bot name and link for child process
router.use(async (ctx: Context, next: Next) => {
  const name: IChildBotName = 'Delline'
  ctx.botName = name;
  ctx.bot = _bot;

  await next();
});
// nested routes for bot API
router.use(nested.routes())

export default router.routes();
