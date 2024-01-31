import https from 'https';
import {
  writeFile, readdir, mkdir, rmdir,
} from 'fs/promises';
import sevenBin from '7zip-bin';
import { extractFull } from 'node-7z';
import { DBFFile } from 'dbffile';
import config from '../config';
import Bot from './Bot';
import { loggerChildProcess } from '../libs/logger';
import * as db from '../libs/db';


// sql query
// delete from streets where index='';
// UPDATE _cities SET status='2' WHERE socr='г' AND code LIKE '___________00';
// UPDATE _cities SET status='1' WHERE code LIKE '__00000000000';
//
// исправление названия в КЛАДР, это эдинственная строка верхнего уровня с таким багом
// update _cities set name='Чувашская', socr='Респ' where socr='Чувашия';
//
// alter table _cities alter index type text[] using array[index];
//
// create table _cities as select * from cities where status!='0';
// alter table _cities add column regcode text, add column regname text, add column fullname text;
//
// CREATE TEMP TABLE temptable as SELECT * FROM _cities;
// update _cities set regcode=left(code, 2);
// update _cities C set regname=(select concat(name, ' ', lower(socr), case lower(socr) when 'край' then'' when 'чувашия' then '' else '.' end) from _cities T where T.regcode=C.regcode and status='1' limit 1);
// update _cities set regname='' where name in ('Москва', 'Байконур', 'Санкт-Петербург', 'Севастополь');
// update _cities set fullname=concat(name, ' ', socr, '.',  case regname when '' then '' else concat(' (', regname, ')') end);
// delete from _cities where status='1' and socr!='г';

// сравнить длину кодов городов и улиц
// select distinct length(code) from streets;

// select regcode, fullname from _cities order by regcode;

/*
create table indexes as 
  select S.index, C.code from streets S
    right join _cities C
    on C.code=substring(S.code, '.{13}')
    ;

    create index idx_icode on indexes(code);


select C.fullname, T.index 
  from _cities C
  join indexes T 
  on T.code=C.code;
  ;

update _cities C set index=array(select index from indexes T where T.code=C.code);

// изменение типа данных со строки на массив строк, если есть данные в столбце
alter table _cities alter index type text[] using index::text[];
// записать результат вызова в массив
// update foo set test=array(select name from bar) where id=2;
*/






export default class Kladr extends Bot {
  tempFolder = './temp/kladr';

  parentSend(message: string) {
    switch (message) {
      case 'update':
        if (this.state.act !== 'run') {
          this.send({ message: 'kladr catalog update start' });
          this.update();
        } else {
          this.send({ error: 'bot run ...' });
        }
        break;
      default: super.parentSend(message);
    }
  }

  async update() {
    this.state.act = 'run';
    this.error = undefined;

    try {
      await Promise.resolve()
        .then(() => this.createTempFolder())
        .then(() => this.downloadKLADR())
        .then(() => this.extractKLADR())

        .then(() => this.createTableStreets())
        .then(() => this.getKladrStreets())
        .then(streets => this.addStreets(streets))

        .then(() => this.createTableCities())
        .then(() => this.getKladrCities())
        .then(cities => this.addCities(cities))
        .then(() => this.processedCities())

        .then(() => this.createTableIndexes())
        .then(() => this.dropTableStreets())

        .catch((error) => { throw error; });

    } catch (error) {
      if (error instanceof Error) {
        loggerChildProcess.error(`error update KLADR: ${error.message}`);
        this.error = error;
      }
    }

    this.state.act = 'wait';
  }

  async processedCities(){
    this.state.task = 'processed cities step 1';

    return Promise.resolve()
      // step 1
        .then(() => this.state.task = 'processed cities step 1')
        .then(() => db.query(`UPDATE _cities SET status='2' WHERE socr='г' AND code LIKE '___________00'`))
        .then(() => db.query(`UPDATE _cities SET status='1' WHERE code LIKE '__00000000000'`))
      // step 2
        .then(() => this.state.task = 'processed cities step 2')
        .then(() => db.query(`update _cities set name='Чувашская', socr='Респ' where socr='Чувашия'`))
      // step 3
        .then(() => this.state.task = 'processed cities step 3')
        .then(() => db.query(`create table cities as select * from _cities where status!='0'`))
        // .then(() => db.query(`drop table _cities`))
      // step 4
        .then(() => this.state.task = 'processed cities step 4')
        .then(() => db.query(`
          alter table cities 
            add column regcode text, 
            add column regname text, 
            add column fullname text,
            alter index type text[] using array[index]
        `))
      // step 5
        .then(() => this.state.task = 'processed cities step 5')
        .then(() => db.query(`update cities set regcode=left(code, 2)`))
      // step 6
        .then(() => this.state.task = 'processed cities step 6')
        .then(() => db.query(`
          update cities C 
            set regname=(
              select concat(
                name, 
                ' ', 
                lower(socr), 
                case lower(socr) 
                  when 'край' then'' 
                  when 'чувашия' then '' 
                  else '.' 
                end
              ) 
              from cities T 
              where T.regcode=C.regcode and status='1' limit 1)
        `))
        .then(() => db.query(`
          update cities 
            set regname='' 
            where name in ('Москва', 'Байконур', 'Санкт-Петербург', 'Севастополь')
        `))
      // step 7
        .then(() => this.state.task = 'processed cities step 7')
        .then(() => db.query(`
          update cities 
            set fullname=concat(
              name, 
              ' ', 
              socr, 
              '.',  
              case regname 
                when '' then '' 
                else concat(' (', regname, ')') 
              end
            )
        `))
      // step 8
        .then(() => this.state.task = 'processed cities step 8')
        .then(() => db.query(`delete from cities where status='1' and socr!='г'`))
  }

  async createTableCities() {
    return db.query(`
      CREATE TABLE _cities (
        id SERIAL PRIMARY KEY,
        name text,
        socr text,
        code text,
        index text,
        gninmb text,
        uno text,
        ocatd text,
        status text
      )
    `)
  }

  async createTableStreets() {
    return db.query(`
      CREATE TABLE streets (
        id SERIAL PRIMARY KEY,
        name text,
        socr text,
        code text,
        index text,
        gninmb text,
        uno text,
        ocatd text
      )
    `)
  }

  async createTableIndexes() {
    return db.query(`
      create table if not exists indexes as
        select S.index, C.code from streets S
          right join cities C
          on C.code=substring(S.code, '.{13}')
    `)
    .then(() => db.query(`create index if not exists idx_icode on indexes(code)`))
  }

  async downloadKLADR() {
    this.state.task = 'download KLADR.7z archive';

    return new Promise((res, rej) => {
      https.get(`${config.catalog.kladr.db}`, async (response) => {
        if (response.statusCode !== 200) {
          rej(new Error(`response status ${response.statusCode}`));
        }

        await writeFile(`${this.tempFolder}/kladr_db.7z`, response).catch((error) => rej(error));
        res(1);
      })
        .once('error', (error) => rej(error));
    });
  }

  async extractKLADR() {
    this.state.task = 'extract KLADR.7z archive';

    return new Promise((res, rej) => {
      const seven = extractFull(`${this.tempFolder}/kladr_db.7z`, this.tempFolder, {
        $bin: sevenBin.path7za, // путь к скрипту распаковки архива
        $defer: false, // не создавать дочерний процесс
      });
      seven.once('end', () => res(1));
      seven.once('error', (error) => rej(error));
    });
  }

  async getKladrCities() {
    return DBFFile.open(`${this.tempFolder}/KLADR.DBF`, {
      encoding: 'cp866',
    });
  }

  async getKladrStreets() {
    return DBFFile.open(`${this.tempFolder}/STREET.DBF`, {
      encoding: 'cp866',
    });
  }

  async addCities(cities: DBFFile) {
    this.state.task = 'write cities for temp table _cities';

    let counter = 0;
    for await (const city of cities) {
        await this.writeCity(city)
          .then(() => {
            if (counter % 250 === 0) {
              this.state.task = `insert ${counter} city in ${cities.recordCount} cities`
              loggerChildProcess.info(`insert ${counter} rows in ${cities.recordCount}`);
            }
          })
          .catch((error) => loggerChildProcess.error(error.message))
          .finally(() => counter += 1);
    }
  }

  async addStreets(streets: DBFFile) {
    this.state.task = 'update streets KLADR';

    let counter = 0;
    for await (const street of streets) {
        if(!!street['index']) {
          
          await this.writeStreet(street)
          .then(() => {
            if (counter % 250 === 0) {
              this.state.task = `insert ${counter} street in ${streets.recordCount} streets`
              loggerChildProcess.info(`insert ${counter} rows in ${streets.recordCount}`);
            }
          })
          .catch((error) => loggerChildProcess.error(error.message))
          .finally(() => counter += 1);
        }
    }
  }

  async writeCity(city: Record<string, unknown>) {
    return db.query(`
      INSERT INTO _cities 
        (name, 
          socr, 
          code, 
          index, 
          gninmb, 
          uno, 
          ocatd, 
          status)
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
    ]);
  }

  async writeStreet(city: Record<string, unknown>) {
    return db.query(`
      INSERT INTO streets 
        (name, 
          socr, 
          code, 
          index, 
          gninmb, 
          uno, 
          ocatd)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
    `, [
      city.NAME,
      city.SOCR,
      city.CODE,
      city.INDEX,
      city.GNINMB,
      city.UNO,
      city.OCATD,
    ])
  }
}
