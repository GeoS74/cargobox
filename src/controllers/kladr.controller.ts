import { Context, Next } from 'koa';
import { IChildBot } from '_bot';
import { createBot } from '../child.process/create';

let bot: IChildBot;

export async function startBot(ctx: Context, next: Next) {
  if (!bot || !bot.connected) {
    bot = createBot('Kladr');
  }
  ctx.bot = bot;
  await next();
}

export function stopBot(ctx: Context) {
  if (ctx.bot.connected) {
    ctx.bot.kill();
  }
  ctx.status = 200;
  ctx.body = 'bot stopped';
}

export async function update(ctx: Context) {
  if (ctx.bot.connected && ctx.bot.command) {
    ctx.status = 200;
    ctx.body = await ctx.bot.command('update');
    return;
  }
  ctx.throw(400);
}

export async function state(ctx: Context) {
  if (ctx.bot.connected && ctx.bot.command) {
    ctx.status = 200;
    ctx.body = await ctx.bot.command('state');
    return;
  }
  ctx.throw(400);
}
