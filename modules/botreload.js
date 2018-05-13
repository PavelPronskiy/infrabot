/*
 *
 * infrabot reload bot
 *
 */

module.exports = {

    id: 'botreload',
    defaultConfig: {
    	basePath: '/opt/infrabot/infrabot',
    	nodeModulesBinPath: './node_modules/.bin'
    },

    plugin(bot, config) {
		// var execSync = require('child_process').execSync;
		bot.on(['/reload'], function(msg) {
			let hostname = execSync('hostname');
			let message = hostname + ' reloaded';
			sendTelegramMessage({
				message: '``` ' + message + ' ```',
				chatID: msg.chat.id,
				replyToMessage: msg.message_id
			});
			return process.exit(0);
		});
    }
};