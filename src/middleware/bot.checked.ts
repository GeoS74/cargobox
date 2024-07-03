import { Context, Next } from 'koa';

export async function isRun(ctx: Context, next: Next) {
  if (ctx.bot.connected && ctx.bot.command) {
    const answer = await ctx.bot.command('state')
      .catch((error: Error) => ctx.throw(500, error.message));

    if (JSON.parse(answer).act === 'run') {
      ctx.throw(400, 'bot is run...');
    }
  }

  await next();
}