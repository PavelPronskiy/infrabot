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
				sendTelegramMessage({
					message: '``` ' + stdout + ' ```',
					chatID: msg.chat.id,
					replyToMessage: msg.message_id
				}).call(bot);
			}, {
				stdio: 'inherit',
				cwd: config.basePath
			});
		});
    }
};