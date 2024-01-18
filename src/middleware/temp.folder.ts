import { Context, Next } from 'koa';
import { readdir, mkdir } from 'fs/promises';

export default async (ctx: Context, next: Next) => {
  await readdir('./temp')
    .catch(async () => mkdir('./temp/kladr', { recursive: true }))
    .finally(next);
};
