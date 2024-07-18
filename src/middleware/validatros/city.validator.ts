import { Context, Next } from 'koa';
import * as db from '../../libs/db';

export async function checkCity(ctx: Context, next: Next) {
  if (typeof ctx.query.city !== 'string' || !ctx.query.city.length) {
    ctx.throw(404, 'city not found');
  }
  ctx.city = ctx.query.city.trim();
  await next();
}

/*
валидаторы checkDerival и checkArrival в сущности одинаковы,
написаны отдельными функциями только для того чтобы понять какой
город не прошёл проверку: отправитель или получатель
*/
export async function checkDerival(ctx: Context, next: Next) {
  try {
    await _checkCityCode(ctx.request.body.derival);
  } catch (e) {
    ctx.throw(400, 'derival not found');
  }

  await next();
}

export async function checkArrival(ctx: Context, next: Next) {
  try {
    await _checkCityCode(ctx.request.body.arrival);
  } catch (e) {
    ctx.throw(400, 'arrival not found');
  }

  await next();
}

async function _checkCityCode(code: string) {
  if (typeof code !== 'string' || code.length !== 13) {
    throw new Error(`${code} not found`);
  }

  await _findCityByCode(code);
}

async function _findCityByCode(code: string) {
  return db.query('select id from cities where code=$1 limit 1', [code])
    .then((res) => {
      if (!res.rows[0]) {
        throw new Error(`${code} not found`);
      }
    })
    .catch(() => { throw new Error(`${code} not found`); });
}
