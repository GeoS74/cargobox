export default class Bot{

  constructor() {
    process.on('message', (message: string) => this._parentSend(message));
  }

  _parentSend(message: string) {
    if(process.send){
      switch(message) {
        case 'kill':
          process.exit(0);
        case 'hello':
          process.send('world');
        case 'state':
          process.send('world');
        default:
          process.send('unknown message')
      }
    }
  }
}