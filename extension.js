const path = require('path');
const { writeFileSync } = require('fs');
const { BehaviorSubject } = require('rxjs');
const { ExtensionContext, window, commands } = require('vscode');
const { BOT, sendContentOfActiveEditor, connectBotFromUrl } = require('./index');
let botLogged = false, CHANNEL_ID = '';

const INITIALIZE_EXTENSION = 0;
const CONNECT_BOT_COMMAND = 1;
const CHANNEL_ID_COMMAND = 2;
const SHARE_CODE_COMMAND = 3;
const DWAPS_COMMANDS = [
  'dwapsInit',
  'dwapsConnectBot',
  'dwapsChannelId',
  'dwapsShareCode',
];
const getCommands = name => 'discord-sharing-code.' + DWAPS_COMMANDS[name];

/**
 * @param {ExtensionContext} context
 */
function activate(context) {
  context.subscriptions.push(
    commands.registerCommand(getCommands(INITIALIZE_EXTENSION), function () {
      const envFileName = path.join(__dirname, 'environment.js');
      const contentEnvFile = ({ appId, botToken }) => `module.exports = {
        BOT_PERMISSIONS: '8',
        APP_ID: '${appId}',
        BOT_TOKEN: '${botToken}',
        CHANNEL_ID: '',
      };`;
      const config = new BehaviorSubject({});
      let sub = config.subscribe(data => {
        if (data.appId && data.botToken) {
          writeFileSync(envFileName, contentEnvFile(data), { encoding: 'utf8' });
          sub.unsubscribe();
        }
      });
      askForInit(['Your application id, please!', 'Your bot token, please!'], config);
    }),
    commands.registerCommand(getCommands(CONNECT_BOT_COMMAND), function () {
      if (!botLogged) botLogged = loginBot();
      const { BOT_PERMISSIONS, APP_ID } = require('./environment');
      connectBotFromUrl(APP_ID, BOT_PERMISSIONS);
    }),
    commands.registerCommand(getCommands(CHANNEL_ID_COMMAND), function () {
      if (!botLogged) botLogged = loginBot();
      getChannelIdFromUser();
    }),
    commands.registerCommand(getCommands(SHARE_CODE_COMMAND), function () {
      if (!botLogged) botLogged = loginBot();
      const { document } = window.activeTextEditor;
      if (document) {
        const fileName = path.basename(document.fileName);
        if (!CHANNEL_ID) {
          getChannelIdFromUser(() => {
            sendContentOfActiveEditor(
              document.getText(),
              CHANNEL_ID,
              fileName);
          });
        }
        else {
          sendContentOfActiveEditor(
            document.getText(),
            CHANNEL_ID,
            fileName);
        }
      }
    })
  );
}

function loginBot() {
  const { BOT_TOKEN } = require('./environment');
  BOT.login(BOT_TOKEN).catch(console.error);
  return true;
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
          config.next({ appId: userInput });
        } else if (ph.includes("bot token")) {
          config.next({ ...config.getValue(), botToken: userInput });
        }
        inputBox.hide();
        placeholders.shift();
        askForInit(placeholders, config);
      }
    })
  }
}

function getChannelIdFromUser(callback) {
  const inputBox = window.createInputBox();
  inputBox.title = 'Discord Sharing Code';
  inputBox.placeholder = 'Your Discord channel ID, please!';
  inputBox.show();
  inputBox.onDidAccept((e) => {
    if (inputBox.value && inputBox.value.length === 18) {
      CHANNEL_ID = inputBox.value;
      if (callback) callback();
    }
    inputBox.hide();
  })
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
