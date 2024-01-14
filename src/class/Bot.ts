export default class Bot implements IBot {
  state: "run" | "wait";
  error?: Error;

  constructor() {
    this.state = "wait";
    process.on('message', (message: string) => this.parentSend(message));
  }

  update() {

  }

  parentSend(message: string) {
    if (process.send) {
      switch (message) {
        case 'state':
          this.send(this.getState());
          break;
        default:
          process.send({error: 'unknown command'});
      }
    }
  }

  getState() {
    return {
      asd:"asd",
      state: "dd",
      error: this.error
    }
  }

  send(data: unknown) {
    if(process.send){
      process.send(JSON.stringify(data));
    }
  }
}
