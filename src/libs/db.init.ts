import { Pool, PoolConfig } from 'pg';
import { logger } from './logger';
import config from '../config';

const data: PoolConfig = {
  user: config.postgres.user,
  host: config.postgres.host,
  database: '',
  password: config.postgres.password,
  port: config.postgres.port,
};

(async () => {
  let pool = new Pool(data);

  // dropped database
  if (process.argv[2] === '--drop') {
    await pool.query(`DROP DATABASE ${config.postgres.database}`)
      .then(() => logger.info(`database "${config.postgres.database}" dropped`))
      .catch((error) => logger.warn(error.message))
      .finally(() => process.exit());
  }

  // create database
  await pool.query(`CREATE DATABASE ${config.postgres.database}`)
    .then(() => logger.info(`create database "${config.postgres.database}"`))
    .catch((error) => logger.warn(error.message));

  // connect new database
  data.database = config.postgres.database;
  pool = new Pool(data);

  await pool.query(`
    CREATE TABLE cities (
      id SERIAL PRIMARY KEY,
      name text,
      socr text,
      code text,
      index text,
      gninmb text,
      uno text,
      ocatd text,
      status text
    );
  `)
    .then(() => logger.info('create table "cities"'))
    .catch((error) => logger.warn(error.message));
  
    await pool.query(`
    CREATE TABLE streets (
      id SERIAL PRIMARY KEY,
      name text,
      socr text,
      code text,
      index text,
      gninmb text,
      uno text,
      ocatd text,
      city_id integer REFERENCES cities ON DELETE CASCADE
    );
  `)
    .then(() => logger.info('create table "cities"'))
    .catch((error) => logger.warn(error.message));

  logger.info(`database "${config.postgres.database}" init complete`);
  process.exit();
})();
