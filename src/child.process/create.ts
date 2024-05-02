import path from 'path';
import childProcess from 'child_process';
import { IChildBot } from '_bot';

export function createBot(botName: botName): IChildBot {
  const bot: IChildBot = childProcess.fork(path.join(__dirname, './run'), [], {
    env: { botName },
  });

  bot.command = (message) => new Promise((res, rej) => {
    if (bot.connected) {
      bot.once('message', (answer) => res(answer));
      bot.send(message);
    }

    // дочерний процесс может быть неожиданно завершён
    // если это произошло, то вызов bot.send(message) подвешивает промис
    // чтобы завершить промис используется слушатель события exit
    bot.once('exit', () => rej(new Error(`bot ${botName} exited`)));
  });

  return bot;
}
