import path from 'path'
import childProcess from 'child_process';
import Router from 'koa-router'

const router = new Router({prefix: '/api/cargobox'})



// class test extends childProcess.ChildProcess {
//   foo = (message: string) => {
//     return new Promise(res => {
//       this.once('message', (answer) => res(answer));
//       this.send(message)
//     })
//   }
// }


// let bot: test | null = null;
let bot: childProcess.ChildProcess | null = null;

 

function _createBot(botName: string) {
  bot = childProcess.fork(path.join(__dirname, '../child.process/bot.create'), [], {
    env:{botName}
  });
}


router.get('/state', async ctx => {
  const text = await new Promise((res, rej) => {
    if(bot) {
      bot.once('message', (answer) => res(answer));
      bot.send('state')
    }
    else rej('bot is empty')
  })

  ctx.status = 200;
  ctx.body = text;
})



router.get('/', async ctx => {
  if(!bot) {
    _createBot('Bot');
    ctx.status = 201;
    ctx.body = 'bot created';
    return;
  }

  ctx.status = 200;
  ctx.body = 'bot is runnung';
})

export default router.routes();