import Router from 'koa-router';
import { Context, Next } from 'koa';
import { IChildBot } from '_bot';
import nested from './bot.nested..routes';
import { searchCity } from '../controllers/city.controller';
import { checkCity } from '../middleware/validatros/city.validator';

const router = new Router({ prefix: '/api/cargobox/kladr' });

// global variable for this module
const _bot: IChildBot = {
  name: 'Kladr',
  process: undefined,
};

// adding in context bot name and link for child process
router.use(async (ctx: Context, next: Next) => {
  ctx.bot = _bot;
  await next();
});
// nested routes for bot API
router.use(nested.routes());

router.get('/search/city', checkCity, searchCity);

export default router.routes();
