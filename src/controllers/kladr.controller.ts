import { Context, Next } from 'koa';
import childProcess from 'child_process';

interface IChildBot extends childProcess.ChildProcess {
  command?: (message: string) => Promise<unknown>
}
let bot: IChildBot;

export function update(ctx: Context, next: Next) {
next()
}

export function go(ctx: Context, next: Next) {
  ctx.status = 200
  }