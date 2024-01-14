import https from 'https';
import { writeFile, unlink } from 'fs/promises';
import config from '../config';
import Bot from './Bot';
import { loggerChildProcess } from '../libs/logger';

// fs.unlink(file.filepath, (err) => {
//   if (err) logger.error(err);
// });

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
    this.error = undefined;

    try {
      await this.downloadKLADR();
    } catch (error) {
      if (error instanceof Error) {
        loggerChildProcess.error(`download KLADR: ${error.message}`);
        this.error = new Error(error.message);
      }
    }

    this.state = 'wait';
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
