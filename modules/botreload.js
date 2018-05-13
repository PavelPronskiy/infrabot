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
		var pm2 = require('pm2');



		bot.on(['/reload'], function(msg) {
			pm2.connect(function(err) {
/*				if (err) {
					console.error(err);
					process.exit(2);
				}*/

				var ret = pm2.restart(process, function(err) {
					console.log('botreload: pm2 error');
				});

				console.log(ret);

				sendTelegramMessage({
					message: '``` ' + ret + ' ```',
					chatID: msg.chat.id,
					replyToMessage: msg.message_id
				});

			});
/*			return childProcess.exec(config.nodeModulesBinPath + '/pm2 reload infrabot', function (error, stdout, stderr) {
		

			}, {
				stdio: 'inherit',
				cwd: config.basePath
			});*/
		});
    }
};