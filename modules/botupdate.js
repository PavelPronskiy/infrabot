/*
 *
 * infrabot uptime
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
							var message = '``` ' + stdout + ' ```';

							childProcess.exec(config.nodeModulesBinPath + '/pm2 reload infrabot', function (error, stdout, stderr) {
								var message = '``` ' + stdout + ' ```';
								console.log('infrabot process reloaded after update');
								return bot.sendMessage(msg.chat.id, message, {
									replyToMessage: msg.message_id,
									parseMode: 'Markdown'
								});
							}, {
								stdio: 'inherit',
								cwd: config.basePath
							});

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
				
			/*} else {
				message = 'Host ' + '*' + hostname + '*' + ' reported:' + "\n" +
				'``` please use: /update status, /update now ```';
				return bot.sendMessage(msg.chat.id, message, {
					replyToMessage: msg.message_id,
					parseMode: 'Markdown'
				});*/
			}

		});

    }
};


/*module.exports = function(telebot) {
	telebot.on(['/uptime'], function(msg) {
		let uptime = execSync('uptime');
		let hostname = execSync('hostname');
		let message = '*' + 'report ' + hostname + '*' +
		'```' + uptime + '```';

		return telebot.sendMessage(msg.chat.id, message, {
			replyToMessage: msg.message_id,
			parseMode: 'Markdown'
		});
	});
};
*/
