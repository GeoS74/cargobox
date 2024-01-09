export class Bot{

  constructor() {
    process.on('message', (message: string) => this._parentSend(message));
  }

  _parentSend(message: string) {
    if(process.send){
      switch(message) {
        case 'state':
          process.send('world');
        default:
          process.send('unknown message')
      }
    }
  }
}