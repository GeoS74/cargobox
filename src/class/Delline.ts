import Bot from './Bot';

export default class Delline extends Bot {
  tempFolder = './temp/Delline';

  // Override
  parentSend(message: string) {
    switch (message) {
      case 'update':
        if (this.state.act !== 'run') {
          this.send({ message: 'Delline catalog update start' });
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

    /////////////////
    // ...code...

    this.state.act = 'wait';
  }
}
