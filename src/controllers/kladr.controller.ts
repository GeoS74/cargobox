import { Context, Next } from 'koa';
import path from 'path'
import childProcess from 'child_process';
import { IChildBot } from '_bot';
import { createBot } from '../child.process/create';

let bot: IChildBot;

export async function startBot(ctx: Context, next: Next) {
  console.log(1)
  if(!bot || !bot.connected) {
    bot = createBot("Kladr");
  }
  await next();
}

export async function sayHello(ctx: Context, next: Next) {
  console.log(2)
  if(bot.connected && bot.command) {
    ctx.status = 400;
    const f = await bot.command('hello');
    ctx.body = f;
    console.log(3)
    return;
  }
  console.log(4)
  ctx.throw(400)
}


export function stopBot(ctx: Context, next: Next) {
  if(bot.connected && bot.command) {
    bot.command('kill')
  }
  ctx.status = 200;
  ctx.body = 'bot stopped'
}

 

export function update(ctx: Context, next: Next) {
  ctx.status = 200;
}

