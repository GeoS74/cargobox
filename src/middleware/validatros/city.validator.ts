import { Context, Next } from 'koa';

export async function checkCity(ctx: Context, next: Next) {
  if (typeof ctx.query.city !== 'string' || !ctx.query.city.length) {
    ctx.throw(404, 'city not found');
  }
  ctx.city = ctx.query.city.trim();
  await next();
}
