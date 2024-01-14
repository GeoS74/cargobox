import path from 'path';
import childProcess from 'child_process';
import { IChildBot } from '_bot';

export function createBot(botName: botName): IChildBot {
  const bot: IChildBot = childProcess.fork(path.join(__dirname, './run'), [], {
    env: { botName },
  });

  bot.command = (message) => new Promise((res) => {
    if (bot.connected) {
      bot.once('message', (answer) => res(answer));
      bot.send(message);
    }
  });
  return bot;
}

// process.on('message', (message) => {
//   if(process.send){
//     process.send(`you say ${message}`)
//   }
// })
// import path from "path"

// import(`../class/${process.env.botName}`)
//   .then(Bot => new Bot())
//   .catch(() => {
//     console.log('---------')
//     console.log(`../class/${process.env.botName}`)
//     console.log(path.join(__dirname, `../class/${process.env.botName}`))
//   })

// import Bot from `../class/${process.env.botName}`;

// new Bot()

// const {Bot} = require(`../class/${process.env.botName}`)
// (() => new Bot())();

// process.exit();
