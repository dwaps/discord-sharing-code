const { Client } = require('discord.js');
exports.BOT = new Client();

const extFormatted = new Map([
  ['js', 'javascript'],
  ['ts', 'typescript'],
  ['py', 'python'],
  ['rb', 'ruby'],
  ['txt', 'text'],
]);

exports.connectBotFromUrl = (APP_ID, BOT_PERMISSIONS) => {
  require('open')(`https://discord.com/api/oauth2/authorize?client_id=${APP_ID}&permissions=${BOT_PERMISSIONS}&scope=bot`);
}

exports.sendContentOfActiveEditor = (CONTENT, CHANNEL_ID, FILE_NAME) => {
  const channel = this.BOT.channels.cache.find(ch => ch.id === CHANNEL_ID);
  if (channel && CONTENT.length) {
    const extFile = FILE_NAME.split('.')[FILE_NAME.split('.').length-1];
    const language = (extFormatted.get(extFile) || extFile);
    channel.send(
      "> ➡   " + FILE_NAME + "\n" +
      "```" + language + "\n" + CONTENT + "\n```");
  }
  setTimeout(() => {
    if (!process.env.WATCH_MODE) process.exit(0);
  }, 500);
}
