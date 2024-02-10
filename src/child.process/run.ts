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

import Kladr from '../class/Kladr';

switch (process.env.botName) {
  case 'Kladr': new Kladr(); break;
  default:
    process.exit();
}
