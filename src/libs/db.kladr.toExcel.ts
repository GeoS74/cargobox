import { Pool, PoolConfig } from 'pg';
const XLSX = require('xlsx');
import path from 'path';
import { logger } from './logger';
import config from '../config';

const data: PoolConfig = {
  user: config.postgres.user,
  host: config.postgres.host,
  database: config.postgres.database,
  password: config.postgres.password,
  port: config.postgres.port,
};

const tempFolder = './temp/kladr';

(async () => {
  const pool = new Pool(data);

  const cities = await pool.query('SELECT * FROM cities')
    .then((res) => res.rows)
    .then(cities => cities.map(city => Object.values(city)));

  let workbook = XLSX.utils.book_new();
  let worksheet = XLSX.utils.aoa_to_sheet(cities);
  XLSX.utils.book_append_sheet(workbook, worksheet);
  XLSX.writeFile(workbook, `${tempFolder}/cities.xlsx`);

  logger.info(`cities from "${config.postgres.database}" create xlsx file`);
  process.exit();
})();
