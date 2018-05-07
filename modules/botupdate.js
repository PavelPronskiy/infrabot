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

						childProcess.exec('bash ./setup.sh status', function (error, stdout, stderr) {
							var message = '``` ' + stdout + ' ```';
							return bot.sendMessage(msg.chat.id, message, {
								replyToMessage: msg.message_id,
								parseMode: 'Markdown'
							});
						}, {
							stdio: 'inherit',
							cwd: config.basePath
						});

					break;
					case 'now':
						childProcess.exec('bash ./setup.sh update', function (error, stdout, stderr) {

							if (stdout.match(/New infrabot version/)) {
								childProcess.exec(config.nodeModulesBinPath + '/pm2 reload infrabot', function (error, stdout, stderr) {
									var cmessage = '``` ' + stdout + ' ```';
									console.log('infrabot process reloaded');
									return bot.sendMessage(msg.chat.id, cmessage, {
										replyToMessage: msg.message_id,
										parseMode: 'Markdown'
									});
								}, {
									stdio: 'inherit',
									cwd: config.basePath
								});
							}

							var message = '``` ' + stdout + ' ```';
							return bot.sendMessage(msg.chat.id, message, {
								replyToMessage: msg.message_id,
								parseMode: 'Markdown'
							});
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