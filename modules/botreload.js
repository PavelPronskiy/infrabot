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
		const childProcess = require('child_process');
		// var pm2 = require('pm2');

		bot.on(['/reload'], function(msg) {

			return childProcess.exec(config.nodeModulesBinPath + '/pm2 reload infrabot', function (error, stdout, stderr) {
				let message = '``` ' + stdout + ' ```';
				console.log(message);

				var sentParam = {
					message: message,
					chatID: msg.chat.id,
					replyToMessage: msg.message_id
				};

				sendTelegramMessage(sentParam).call(bot);
				bot.sendMessage(msg.chat.id, message, {
					replyToMessage: msg.message_id,
					parseMode: 'Markdown'
				});
			}, {
				stdio: 'inherit',
				cwd: config.basePath
			});

		});
    }
};