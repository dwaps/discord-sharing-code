const path = require('path');
const { writeFile, existsSync } = require('fs');
const { BehaviorSubject } = require('rxjs');
const { ExtensionContext, window, commands } = require('vscode');
const { BOT, sendCodeToChannel, connectBotFromUrl } = require('./index');

let sub1 = null, sub2 = null, mainConfig = new BehaviorSubject({});
const envFileName = path.join(__dirname, 'environment.json');
let botLogged = false;
existsSync(envFileName) && loginBot()
  .then(() => botLogged = true)
  .catch(console.error);

const INITIALIZE_EXTENSION_CMD = 0;
const CONNECT_BOT_CMD = 1;
const CHANNEL_ID_CMD = 2;
const SHARE_CODE_CMD = 3;
const DWAPS_COMMANDS = [
  'init',
  'connectBot',
  'updateChannel',
  'shareCode',
];
const getCommands = idCommand => `discord-sharing-code.${DWAPS_COMMANDS[idCommand]}`;

/**
 * @param {ExtensionContext} context
 */
function activate(context) {

  sub1 = mainConfig.subscribe(data => {
    if (data.APP_ID && data.BOT_TOKEN && data.CHANNEL_ID) {
      data.BOT_PERMISSIONS = 8;
    }
    else if (data.CHANNEL_ID && existsSync(envFileName)) {
      const { APP_ID, BOT_PERMISSIONS, BOT_TOKEN } = require('./environment');
      data.APP_ID = APP_ID;
      data.BOT_PERMISSIONS = BOT_PERMISSIONS;
      data.BOT_TOKEN = BOT_TOKEN;
    }
    else if (data.CHANNEL_ID && !existsSync(envFileName)) {
      initializeExtension(data.CHANNEL_ID);
      return;
    }
    if (data.APP_ID && data.BOT_PERMISSIONS && data.BOT_TOKEN && data.CHANNEL_ID) {
      writeFile(envFileName, JSON.stringify(data), (err) => {
          if (err) throw `\n[DWAPS ERROR]: ${err}\n`;
          if (!botLogged) {
            loginBot()
              .then(() => botLogged = true) 
              .catch(console.error);
          }
        }
      );
    }
  });

  // INITIALIZE EXTENSION FUNCTION
  function initializeExtension(channelId, cb) {
    const asks = [
      'Your application id, please!',
      'And now, your bot token!',
    ];
    if (!channelId) asks.push('And... the channel id you want to share code.');
    askForInit(asks, mainConfig);
    sub2 = mainConfig.subscribe((data) => {
      if (data.APP_ID && data.BOT_PERMISSIONS && data.BOT_TOKEN && data.CHANNEL_ID) {
        setTimeout(() => {
          cb();
        }, 500);
        sub2.unsubscribe();
      }
    });
  }
  // CONNECT BOT TO SERVER FUNCTION
  function connectBotToServer() {
    if (!existsSync(envFileName)) {
      initializeExtension(null, connectBotToServer);
      return;
    }
    const { BOT_PERMISSIONS, APP_ID } = require('./environment');
    connectBotFromUrl(APP_ID, BOT_PERMISSIONS);
  }
  // UPDATE CHANNEL ID FUNCTION
  function updateChannelId() {
    if (!existsSync(envFileName)) {
      initializeExtension();
      return;
    }
    askForInit([
      'Your new channel id, please!',
    ], mainConfig);
  }
  // SHARE CODE FUNCTION
  function shareCode() {
    if (!existsSync(envFileName)) {
      initializeExtension(null, shareCode);
      return;
    }
    if (botLogged) {
      const { document } = window.activeTextEditor;
      if (document) {
        const fileName = path.basename(document.fileName);
        const { CHANNEL_ID } = require('./environment');
        sendCodeToChannel(
          document.getText(),
          CHANNEL_ID,
          fileName);
      }
    }
    else {
      loginBot().then(() => {
        botLogged = true;
        shareCode();
      }).catch(console.error);
    }
  }

  context.subscriptions.push(
    commands.registerCommand(getCommands(INITIALIZE_EXTENSION_CMD), initializeExtension),
    commands.registerCommand(getCommands(CONNECT_BOT_CMD), connectBotToServer),
    commands.registerCommand(getCommands(CHANNEL_ID_CMD), updateChannelId),
    commands.registerCommand(getCommands(SHARE_CODE_CMD), shareCode)
  );
}

// FUNCTIONS
function loginBot() {
  const { BOT_TOKEN } = require('./environment');
  return BOT.login(BOT_TOKEN);
}
function askForInit(placeholders, config) {
  if (placeholders && placeholders.length) {
    const inputBox = window.createInputBox();
    const [ ph ] = placeholders;
    inputBox.title = 'Discord Sharing Code';
    inputBox.placeholder = ph;
    inputBox.show();
    inputBox.onDidAccept((e) => {
      const userInput = inputBox.value;
      if (userInput) {
        if (ph.includes("application id")) {
          config.next({ APP_ID: userInput });
        } else if (ph.includes("bot token")) {
          config.next({ ...config.getValue(), BOT_TOKEN: userInput });
        } else if (ph.includes("channel id")) {
          config.next({ ...config.getValue(), CHANNEL_ID: userInput });
        }
        inputBox.hide();
        placeholders.shift();
        askForInit(placeholders, config);
      }
    })
  }
}

function deactivate() {
  console.info("\n[DWAPS INFO]: Fonction deactivate appelée !\n")
  if (sub1) sub1.unsubscribe();
  if (sub2) sub2.unsubscribe();
}

module.exports = {
	activate,
	deactivate
}
