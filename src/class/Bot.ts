export default class Bot implements IBot {
  state: BotState;

  error?: Error;

  constructor() {
    this.state = 'wait';
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
      state: this.state,
      error: this.error?.message,
    };
  }

  send(data: unknown) {
    if (process.send) {
      process.send(JSON.stringify(data));
    }
  }
}
