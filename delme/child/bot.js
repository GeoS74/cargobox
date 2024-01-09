process.on('message', (message) => {
  process.send(`you say ${message}`)
})