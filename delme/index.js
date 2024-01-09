const childProcess = require('child_process')

const bot = childProcess.fork('./delme/child/bot');

  bot.on('message', message => {
    console.log(`bot send: ${message}`)
})

bot.send('foo')

console.log(__dirname)