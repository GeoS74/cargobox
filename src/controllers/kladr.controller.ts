import { Context, Next } from 'koa';
import { IChildBot } from '_bot';
import { createBot } from '../child.process/create';

let bot: IChildBot;

export async function isRunningBot(ctx: Context, next: Next) {
  if (ctx.bot.connected && ctx.bot.command) {
    const answer = await ctx.bot.command('state')
      .catch((error: Error) => ctx.throw(500, error.message));

    if (JSON.parse(answer).state === 'run') {
      ctx.throw(400, 'bot run...');
    }
  }

  await next();
}

export async function startBot(ctx: Context, next: Next) {
  if (!bot || !bot.connected) {
    bot = createBot('Kladr');
  }
  ctx.bot = bot;
  await next();
}

export function stopBot(ctx: Context) {
  if (ctx.bot && ctx.bot.connected) {
    ctx.bot.kill();
    ctx.status = 200;
    ctx.body = 'bot stopped';
    return;
  }
  ctx.throw(400);
}

export async function update(ctx: Context, next: Next) {
  if (ctx.bot.connected && ctx.bot.command) {
    const answer = JSON.parse(await ctx.bot.command('update'))
      .catch((error: Error) => ctx.throw(500, error.message));

    if (answer?.error) {
      ctx.throw(400, answer.error);
    }

    ctx.status = 200;
    ctx.body = answer;
    return next();
  }

  // линтер требует указать return перед ctx.throw, т.к. в этой функции есть "return next()"  
  // правило "consistent-return" предполагает указывать return если в функции есть хоть один return, возвращающий значение
  // интересно, что в функции "async function state(...)" линтер не требует return перед ctx.throw
  // т.к. функция state и так и так ничего не возвращает
  return ctx.throw(400);           
}

export async function state(ctx: Context) {
  if (ctx.bot.connected && ctx.bot.command) {
    ctx.status = 200;
    ctx.body = await ctx.bot.command('state')
      .catch((error: Error) => ctx.throw(500, error.message));

    return;
  }
  ctx.throw(400);
}
