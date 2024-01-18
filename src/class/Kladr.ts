import https from 'https';
import { writeFile, unlink } from 'fs/promises';
import sevenBin from '7zip-bin';
import { extractFull } from 'node-7z';
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
        if (this.state !== 'run') {
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
    this.state = 'run';
    this.error = undefined;

    try {
      await this.downloadKLADR().catch((error) => { throw error; });
      await this.extractKLADR().catch((error) => { throw error; });
    } catch (error) {
      if (error instanceof Error) {
        loggerChildProcess.error(`update KLADR: ${error.message}`);
        this.error = error;
      }
    }

    this.state = 'wait';
  }

  async extractKLADR() {
    return new Promise((res, rej) => {
      const seven = extractFull('./temp/kladrdb.7z', './temp/extract/kladr/', {
        $bin: sevenBin.path7za, // путь к скрипту распаковки архива
        $defer: false, // не создавать дочерний процесс
      });
      seven.once('end', () => res(1));
      seven.once('error', (error) => rej(error));
    });
  }

  async downloadKLADR() {
    return new Promise((res, rej) => {
      https.get(`${config.catalog.kladr.db}`, async (response) => {
        if (response.statusCode !== 200) {
          rej(new Error(`response status ${response.statusCode}`));
        }

        await writeFile('./temp/kladrdb.7z', response).catch((error) => rej(error));
        res(1);
      })
      .once('error', (error) => rej(error));
    });
  }
}
