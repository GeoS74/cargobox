import Router from 'koa-router';
import { Context } from 'koa';
import { koaBody } from 'koa-body';
import { checkDerival, checkArrival } from '../middleware/validatros/city.validator';

const router = new Router({ prefix: '/api/cargobox/calculate' });

router.post(
  '/',
  koaBody({ multipart: true }),
  checkDerival,
  checkArrival,
  async (ctx: Context) => {
    ctx.status = 200;
    ctx.body = ctx.request.body;
  },
);

export default router.routes();
