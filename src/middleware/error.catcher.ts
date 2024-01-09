import { Context, Next, HttpError } from 'koa';
import { logger } from '../libs/logger';

export default async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof HttpError) {
      ctx.status = error.status;
      ctx.body = {
        error: error.message,
      };
      return;
    }

    if (error instanceof Error) {
      logger.error(error.message);
    }

    ctx.status = 500;
    ctx.body = {
      error: 'internal server error',
    };
  }
};
