import https from 'https';
import { writeFile } from 'fs/promises';
import config from '../config';
import Bot from './Bot';
import { loggerChildProcess } from '../libs/logger';

export default class Kladr extends Bot {
  parentSend(message: string) {
    switch (message) {
      case 'update':
        this.update();
        this.send({ message: 'kladr catalog update start' });
        break;
      default:
        super.parentSend(message);
    }
  }

  async update() {
    this.state = 'run';

    try {
      await this.downloadKLADR();
    } catch (error) {
      if (error instanceof Error) {
        loggerChildProcess.error(`download KLADR: ${error.message}`);
        this.error = new Error(error.message);
      }
    }

    this.state = 'wait';
    this.error = undefined;
  }

  async downloadKLADR() {
    return new Promise((res, rej) => {
      https.get(`${config.catalog.kladr.db}fail`, async (response) => {
        if (response.statusCode !== 200) {
          return rej(new Error(`response status ${response.statusCode}`));
        }
        await writeFile('./temp/kladrdb.7z', response);
        return res(1);
      });
    })
      .catch((error) => { throw error; });
  }
}
