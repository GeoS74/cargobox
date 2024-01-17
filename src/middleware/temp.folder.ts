import { Context, Next } from 'koa';
import { readdir, mkdir } from 'fs/promises';

export default async (ctx: Context, next: Next) => {
  try {
    await readdir('./temp');
  } catch (error) {
    await mkdir('./temp');
  }
  await next();
};
