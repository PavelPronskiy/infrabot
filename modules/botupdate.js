/*
 *
 * infrabot update sources
 *
 */

module.exports = {

    id: 'botupdate',
    defaultConfig: {
    	basePath: '/opt/infrabot/infrabot',
    	nodeModulesBinPath: './node_modules/.bin'
    },

    plugin(bot, config) {
		// var execSync = require('child_process').execSync;
		const childProcess = require('child_process');
		// var pm2 = require('pm2');

		bot.on(['/update'], function(msg) {
			
			// var hostname = execSync('hostname');
			var method = msg.text.split(' ');
			var updateResult = 'No results.';

			if (method[1]) {
				switch(method[1]) {
					case 'status':

						return childProcess.exec('bash ./setup.sh status', function (error, stdout, stderr) {
							sendTelegramMessage({
								message: '``` ' + stdout + ' ```',
								chatID: msg.chat.id,
								replyToMessage: msg.message_id
							});
						}, {
							stdio: 'inherit',
							cwd: config.basePath
						});

					break;
					case 'now':

						sendTelegramMessage({
							message: 'Get new update...',
							chatID: msg.chat.id,
							replyToMessage: msg.message_id
						});

						childProcess.exec('bash ./setup.sh update', function (error, stdout, stderr) {

							if (stdout.match(/New infrabot version/g)) {

								bot.editMessageText({ msg.from.id, msg.message_id }, `${ stdout }`, { parseMode: 'Markdown'	}).catch(error => console.log('Error:', error));

								return process.exit(0);
								/*return childProcess.exec(config.nodeModulesBinPath + '/pm2 reload infrabot', function (error, stdout, stderr) {
									console.log('infrabot process reloaded');
									sendTelegramMessage({
										message: '``` ' + stdout + ' ```',
										chatID: msg.chat.id,
										replyToMessage: msg.message_id
									});
								}, {
									stdio: 'inherit',
									cwd: config.basePath
								});*/
							} else {

								return bot.editMessageText({ msg.from.id, msg.message_id }, `${ stdout }`, { parseMode: 'Markdown' }).catch(error => console.log('Error:', error));
							}
						}, {
							stdio: 'inherit',
							cwd: config.basePath
						});

					break;
				}
			}
		});
    }
};