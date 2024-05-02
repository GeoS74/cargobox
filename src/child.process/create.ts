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
    // если это произошло, то вызов bot.send(message) подвесит промис
    // для завершения промиса используется слушатель события disconnect
    bot.once('disconnect', () => rej(new Error(`bot ${botName} disconnected`)));
  })
  // удалить всех слушателей событий
    .finally(() => bot.removeAllListeners());

  return bot;
}
