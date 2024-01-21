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
      await this.createTempFolder();
      // await this.downloadKLADR().catch((error) => { throw error; });
      // await this.extractKLADR().catch((error) => { throw error; });
      await this.updateCities().catch((error) => { throw error; });
      await this.updateStreets().catch((error) => { throw error; });
      // await this.deleteTempFolder();
    } catch (error) {
      if (error instanceof Error) {
        loggerChildProcess.error(`update KLADR: ${error.message}`);
        this.error = error;
      }
    }

    this.state.act = 'wait';
  }

  async downloadKLADR() {
    this.state = {task: 'download KLADR.7z archive'};

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
    this.state = {task: 'extract KLADR.7z archive'};

    return new Promise((res, rej) => {
      const seven = extractFull(`${this.tempFolder}/kladr_db.7z`, this.tempFolder, {
        $bin: sevenBin.path7za, // путь к скрипту распаковки архива
        $defer: false, // не создавать дочерний процесс
      });
      seven.once('end', () => res(1));
      seven.once('error', (error) => rej(error));
    });
  }

  async updateCities() {
    this.state.task = 'update cities KLADR';

    const kladr = await DBFFile.open(`${this.tempFolder}/KLADR.DBF`, {
      encoding: 'cp866',
    });

    let counter = 0;
    for await (const city of kladr) {
      // if (city.SOCR === 'г') {

        await this.writeCity(city)
          .then(() => {
            if (counter % 250 === 0) {
              this.state.task = `insert ${counter} city in ${kladr.recordCount} cities`
              loggerChildProcess.info(`insert ${counter} rows in ${kladr.recordCount}`);
            }
          })
          .catch((error) => loggerChildProcess.error(error.message))
          .finally(() => counter += 1);
      // }
    }
  }

  async updateStreets() {
    this.state.task = 'update streets KLADR';

    const streets = await DBFFile.open(`${this.tempFolder}/STREET.DBF`, {
      encoding: 'cp866',
    });

    // loggerChildProcess.error(streets.recordCount)
    // loggerChildProcess.error(`Field names: ${streets.fields.map(f => f.name).join(', ')}`)

    let counter = 0;
    for await (const street of streets) {

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

  async writeCity(city: Record<string, unknown>) {
    return db.query(`
      INSERT INTO cities 
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
    ])
      .catch((error) => loggerChildProcess.error(error.message));
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
      .catch((error) => loggerChildProcess.error(error.message));
  }
}
