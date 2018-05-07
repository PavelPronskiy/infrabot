/*
 *
 * infrabot logic
 *
 */

const VERSION = '0.1.0';

require('dotenv').config();

const stdio = require('stdio');
const execSync = require('child_process').execSync;
const requestp = require('request-promise');
const teleBotInstance = require('telebot');

const hostname = execSync('hostname');

// telegram instance
const telebot = new teleBotInstance({
	token: process.env.MY_TOKEN,
	pluginFolder: __dirname + '/modules/',
	usePlugins: ['uptime', 'botupdate', 'ping'],
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
		args: 2,
		description: "\n\n" + 'method' + "\n" +
			"\t" + '-m server start' + "\n" +
			"\t" + '-m server stop' + "\n"
	}
});

function printInfraBotVersion() {
	let message = 'InfraBot installed version: ' + VERSION;
	return message;
}

function printTelebotHelp(msg) {

	let message = "\n" +
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
	let message = printInfraBotVersion();
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


/*var telePing = require('./modules/telePing');
var uptime = require('./modules/uptime');

telePing(telebot);
uptime(telebot);
*/
switch(getopt.method[0]) {
	case 'version':
			printInfraBotVersion();
		break;
	case 'server':
		switch(getopt.method[1]) {
			case 'start':
				var message = 'Host ' + '*' + hostname + '*' + ' reported: infrabot online';
				telebot.sendMessage(process.env.CHAT_ID, message, {
					parseMode: 'Markdown'
				});

				console.log(message);
				telebot.start();
			break;
			case 'stop':
				console.log('stopping server');
				telebot.stop();
				process.exit(-1);
			break;
		}
	break;
	default: getopt.printHelp();
}

