import { Pool, PoolConfig } from 'pg';
import path from 'path';
import DBFFile from 'dbffile';
import { logger } from './logger';
import config from '../config';

const data: PoolConfig = {
  user: config.postgres.user,
  host: config.postgres.host,
  database: config.postgres.database,
  password: config.postgres.password,
  port: config.postgres.port,
};

(async () => {
  const kladr = await DBFFile.open(path.join(__dirname, '../../kladr/KLADR.DBF'), {
    encoding: 'cp866',
  });

  // EXAMPLE USING PACKAGE "dbffile"
  // console.log(`DBF file contains ${kladr.recordCount} records.`);
  // console.log(`Field names: ${kladr.fields.map(f => f.name).join(', ')}`);
  // for await (const record of kladr) console.log(record);

  const pool = new Pool(data);

  // clean table cities
  if (process.argv[2] === '--clean') {
    await pool.query('DELETE FROM cities')
      .then(() => logger.info('table "cities" deleted'))
      .catch((error) => logger.warn(error.message));
  }

  // load cities
  let counter = 0;
  for await (const city of kladr) {
    await pool.query(`
      INSERT INTO cities 
        (name, socr, code, index, gninmb, uno, ocatd, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
    `, [
      city.NAME,
      city.SOCR,
      city.CODE,
      city.INDEX,
      city.GNINMB,
      city.UNO,
      city.OCATD,
      city.STATUS,
    ])
      .then((res) => {
        if (counter % 250 === 0) {
          logger.info(`insert ${counter} rows in ${kladr.recordCount}`);
        }
      })
      // .then(() => logger.info('create table "cities"'))
      .catch((error) => logger.warn(error.message))
      .finally(() => counter++);
  }

  logger.info(`database "${config.postgres.database}" load complete`);
  process.exit();
})();
