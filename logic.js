/*
 *
 * infrabot logic
 *
 */

const VERSION = '0.1.5.1';

// require('dotenv').config();
const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');

let env = dotenv.config({});
if (env.error) throw env.error;
env = dotenvParseVariables(env.parsed);


const stdio = require('stdio');
const execSync = require('child_process').execSync;
const requestp = require('request-promise');
const teleBotInstance = require('telebot');

const hostname = execSync('hostname');

// console.log(env);

// telegram instance
const telebot = new teleBotInstance({
	token: process.env.MY_TOKEN,
	pluginFolder: __dirname + '/modules/',
	usePlugins: env.INFRABOT_PLUGINS,
	polling: {
		interval: 1000,
		timeout: 0,
		limit: 100,
		retryTimeout: 5000,
		proxy: process.env.PROXY_ADDR
	}
});

// cli params
const getopt = stdio.getopt({
	method: {
		key: 'm',
		args: 1,
		description: "\n\n" + 'method' + "\n" +
			"\t" + '-m run' + "\n"
	}
});

function printInfraBotVersion() {
	var message = 'InfraBot installed version: ' + VERSION;
	return message;
}

function printTelebotHelp(msg) {

	var message = "\n" +
	'/uptime - get uptime' + "\n" +
	'/ping google.com - ping target host' + "\n" +
	'/help' + "\n";

	return telebot.sendMessage(msg.chat.id, message, {
		replyToMessage: msg.message_id,
		parseMode: 'Markdown'
	});
}

telebot.on(['/help'], function(msg) {
	return printTelebotHelp(msg);
});

telebot.on(['/version'], function(msg) {
	var message = printInfraBotVersion();
	return telebot.sendMessage(msg.chat.id, message, {
		replyToMessage: msg.message_id,
		parseMode: 'Markdown'
	});
});


if (typeof getopt.method === 'undefined') {
	// console.log('No defined option args');
	getopt.printHelp();
	return process.exit(1);
}

switch(getopt.method) {
	case 'run':
		var message = 'Host ' + '*' + hostname + '*' + ' reported: infrabot online' + "\n" +
			'infrabot version: ' + VERSION;

		telebot.sendMessage(process.env.CHAT_ID, message, {
			parseMode: 'Markdown'
		});

		console.log(message);
		telebot.start();
	break;
	default: getopt.printHelp();
}

