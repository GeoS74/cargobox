import path from 'path'
import childProcess from 'child_process';
import Router from 'koa-router'

const router = new Router({prefix: '/api/cargobox'})


interface IChildBot extends childProcess.ChildProcess {
  command?: (message: string) => Promise<unknown>
}

let bot: IChildBot;


function _createBot(botName: string): IChildBot {
  const b: IChildBot = childProcess.fork(path.join(__dirname, '../child.process/bot.create'), [], {
    env:{botName}
  });

  b.command = (message) => new Promise(res => {
    if(b.connected) {
      b.once('message', (answer) => res(answer));
      b.send(message)
    }
  })
  return b;
}


router.get('/state', async ctx => {
  if(!bot.connected) {
    ctx.throw(400, 'bot down');
  }

  if(bot?.command) {
    bot.command('foo')
  }

  ctx.status = 200;
  ctx.body = bot.connected;
})



router.get('/', async ctx => {
  if(!bot) {
    bot = _createBot('Bot');
    console.log(bot);
    ctx.status = 201;
    ctx.body = 'bot created';
    return;
  }
  console.log(bot);
  ctx.status = 200;
  ctx.body = 'bot is runnung';
})

export default router.routes();