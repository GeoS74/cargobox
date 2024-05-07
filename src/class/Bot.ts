import {
  readdir, mkdir, rm,
} from 'fs/promises';

type StateBot = { [index: string]: string | number };

export default abstract class Bot {
  abstract tempFolder: string;

  state: StateBot;

  error?: Error;

  constructor() {
    this.state = { act: 'wait' };
    process.on('message', (message: string) => this.parentSend(message));
  }

  parentSend(message: string) {
    switch (message) {
      case 'state':
        this.send(this.getState());
        break;
      default:
        this.send({ error: 'unknown command' });
    }
  }

  getState() {
    return {
      ...this.state,
      error: this.error?.message || undefined,
    };
  }

  send(data: unknown) {
    if (process.send) {
      process.send(JSON.stringify(data));
    }
  }

  async createTempFolder() {
    return readdir(this.tempFolder)
      .catch(async () => mkdir(this.tempFolder, { recursive: true }));
  }

  async deleteTempFolder() {
    await rm(this.tempFolder, { recursive: true });
  }
}
