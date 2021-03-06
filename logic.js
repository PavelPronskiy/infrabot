/*
 *
 * infrabot logic
 *
 */

const VERSION = '0.1.5.9';

// require('dotenv').config();
const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');

const buf = new Buffer('BASIC=basic');
const config = dotenv.parse(buf); // will return an object

let env = dotenv.config({});
if (env.error) throw env.error;
env = dotenvParseVariables(env.parsed);

const moment = require('moment');

const stdio = require('stdio');
const execSync = require('child_process').execSync;
const requestp = require('request-promise');
const teleBotInstance = require('telebot');


// console.log(env);
const telebotSettings = {
	token: env.MY_TOKEN,
	pluginFolder: __dirname + '/modules/',
	usePlugins: env.INFRABOT_PLUGINS,
	polling: {
		interval: (typeof env.INFRABOT_POLLING_INTERVAL != 'undefined') ?
			env.INFRABOT_POLLING_INTERVAL :
			10000,
		timeout: (typeof env.INFRABOT_POLLING_TIMEOUT != 'undefined') ?
			env.INFRABOT_POLLING_TIMEOUT :
			0,
		limit: (typeof env.INFRABOT_POLLING_LIMIT != 'undefined') ?
			env.INFRABOT_POLLING_LIMIT :
			100,
		retryTimeout: (typeof env.INFRABOT_POLLING_RETRYTIMEOUT != 'undefined') ?
			env.INFRABOT_POLLING_RETRYTIMEOUT :
			5000
	}
};

if (env.PROXY_ADDR) {
	telebotSettings.polling.proxy = env.PROXY_ADDR;
}

// telegram instance
const bot = new teleBotInstance(telebotSettings);

module.exports = sendTelegramMessage = function(param) {

	var momentjs = moment();
	var timestamp = momentjs.format('YYYY-MM-DD HH:mm:ss');

	var sentParam = {
		parseMode: 'Markdown'
	};

	if (param.replyToMessage) {
		sentParam.replyToMessage = param.replyToMessage;
	}

	param.message = '🤘🏻 ' + param.message;

	// console.log(message);
	return bot.sendMessage(param.chatID, param.message, sentParam);

};

// cli params
const getopt = stdio.getopt({
	method: {
		key: 'm',
		args: 1,
		description: "\n\n" + 'method' + "\n" +
			"\t" + '-m run' + "\n"
	}
});

// timestamp
function printInfraBotVersion() {
	var message = 'InfraBot installed version: ' + VERSION;
	return message;
}

function printTelebotHelp(msg) {
	return sendTelegramMessage({
		message: "\n" +
	'/uptime - get uptime' + "\n" +
	'/ping google.com - ping target host' + "\n" +
	'/help' + "\n",
		chatID: msg.chat.id,
		replyToMessage: msg.message_id
	});
}

bot.on(['/help'], function(msg) {
	return printTelebotHelp(msg);
});

bot.on(['/version'], function(msg) {
	return sendTelegramMessage({
		message: printInfraBotVersion(),
		chatID: msg.chat.id,
		replyToMessage: msg.message_id
	});
});


if (typeof getopt.method === 'undefined') {
	// console.log('No defined option args');
	getopt.printHelp();
	return process.exit(1);
}

switch(getopt.method) {
	case 'run':
		var hostname = execSync('hostname');
		// var momentjs = moment();
		// var timestamp = momentjs.format('YYYY-MM-DD HH:mm:ss');
		sendTelegramMessage({
			message: 'host ' + '*' + hostname + '*' + ' reported: infrabot online' + "\n" +
				'infrabot version: ' + VERSION,
			chatID: env.CHAT_ID
		});

		bot.start();
	break;
	default: getopt.printHelp();
}

