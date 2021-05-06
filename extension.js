const path = require('path');
const { writeFileSync } = require('fs');
const { BehaviorSubject } = require('rxjs');
const { ExtensionContext, window, commands } = require('vscode');
const { BOT, sendCodeToChannel, connectBotFromUrl } = require('./index');
let mainConfig = null, CHANNEL_ID = '', subscription = null;

const INITIALIZE_EXTENSION_CMD = 0;
const CONNECT_BOT_CMD = 1;
const CHANNEL_ID_CMD = 2;
const SHARE_CODE_CMD = 3;
const DWAPS_COMMANDS = [
  'init',
  'connectBot',
  'channelId',
  'shareCode',
];
const getCommands = idCommand => `discord-sharing-code.${DWAPS_COMMANDS[idCommand]}`;

/**
 * @param {ExtensionContext} context
 */
function activate(context) {

  // INITIALIZE EXTENSION FUNCTION
  function initializeExtension() {
    const envFileName = path.join(__dirname, 'environment.js');
    mainConfig = new BehaviorSubject({});
    subscription = mainConfig.subscribe(data => {
      if (data.appId && data.botToken && data.channelId) {
        const { appId, botToken, channelId } = data;
        writeFileSync(
          envFileName,
          `module.exports = { BOT_PERMISSIONS: '8', APP_ID: '${appId}', BOT_TOKEN: '${botToken}', CHANNEL_ID: '${channelId}'};`,
          { encoding: 'utf8' });
        CHANNEL_ID = channelId;
        loginBot();
      }
    });
    askForInit([
      'Your application id, please!',
      'And now, your bot token!',
      'And... the channel id you want to share code.'
    ], mainConfig);
  }
  // CONNECT BOT FUNCTION
  function connectBot() {
    if (!mainConfig) {
      initializeExtension();
      return;
    }
    const { BOT_PERMISSIONS, APP_ID } = require('./environment');
    connectBotFromUrl(APP_ID, BOT_PERMISSIONS);
  }
  // GET CHANNEL ID FUNCTION
  function updateChannelId() {
    if (!mainConfig) {
      initializeExtension();
      return;
    }
    askForInit([
      'Your new channel id, please!',
    ], mainConfig);
  }
  // SHARE CODE FUNCTION
  function shareCode() {
    if (!mainConfig) {
      initializeExtension();
      return;
    }
    const { document } = window.activeTextEditor;
    if (document) {
      const fileName = path.basename(document.fileName);
      if (CHANNEL_ID) {
        sendCodeToChannel(
          document.getText(),
          CHANNEL_ID,
          fileName);
      }
      else {
        console.log("\n[DWAPS ERROR]: L'identifiant du channel n'existe pas ou n'est pas valable!\n")
      }
    }
  }

  context.subscriptions.push(
    commands.registerCommand(getCommands(INITIALIZE_EXTENSION_CMD), initializeExtension),
    commands.registerCommand(getCommands(CONNECT_BOT_CMD), connectBot),
    commands.registerCommand(getCommands(CHANNEL_ID_CMD), updateChannelId),
    commands.registerCommand(getCommands(SHARE_CODE_CMD), shareCode)
  );
}

// FUNCTIONS
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
        } else if (ph.includes("channel id")) {
          config.next({ ...config.getValue(), channelId: userInput });
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
  inputBox.placeholder = 'Your new channel id, please!';
  inputBox.show();
  inputBox.onDidAccept((e) => {
    if (inputBox.value && inputBox.value.length === 18) {
      CHANNEL_ID = inputBox.value;
      if (callback) callback();
    }
    inputBox.hide();
  })
}

function deactivate() {
  if (subscription) subscription.unsubscribe();
}

module.exports = {
	activate,
	deactivate
}
