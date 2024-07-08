import { Context } from 'koa';
import * as db from '../libs/db';
import mapper from '../mappers/city.mapper';

const LIMIT_ROWS = 10;

export async function searchCity(ctx: Context) {
  const cities = await _getCity(ctx.city);

  if (!cities.length) {
    ctx.throw(404, 'city not found');
  }

  ctx.status = 200;
  ctx.body = cities.map((city) => mapper(city));
}

async function _getCity(city: string): Promise<City[]> {
  return db.query(`
    select * from cities
      where lower(fullname) like lower($1 || '%')
      limit ${LIMIT_ROWS}
    `, [city])
    .then((res) => res.rows);
}
