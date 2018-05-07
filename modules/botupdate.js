/*
 *
 * infrabot uptime
 *
 */

module.exports = {

    id: 'botupdate',
    defaultConfig: null,

    plugin(bot, config) {
		// var execSync = require('child_process').execSync;
		const childProcess = require('child_process');
        
		bot.on(['/update'], function(msg) {
			
			// var hostname = execSync('hostname');
			var method = msg.text.split(' ');
			var updateResult = 'No results.';

			if (method[1]) {
				switch(method[1]) {
					case 'status':
						
						childProcess.exec('bash ./setup.sh status', function (error, stdout, stderr) {
							/*console.log('stdout: ' + stdout);
							console.log('stderr: ' + stderr);*/

							/*if (stderr !== null) {
								var message = '``` ' + stderr + ' ```';
								return bot.sendMessage(msg.chat.id, message, {
									replyToMessage: msg.message_id,
									parseMode: 'Markdown'
								});
							} else {
*/

							var message = '``` ' + stdout + ' ```';
							return bot.sendMessage(msg.chat.id, message, {
								replyToMessage: msg.message_id,
								parseMode: 'Markdown'
							});

							// }

						}, {
							stdio: 'inherit',
							cwd: '/opt/infrabot/infrabot'
						});

					break;
						// console.log(execSync('bash ' + __dirname + '/../setup.sh update'));
					case 'now':
						childProcess.exec('bash ./setup.sh update', function (error, stdout, stderr) {
							console.log('stdout: ' + stdout);
							console.log('stderr: ' + stderr);

							if (stderr !== null) {
								var message = '``` ' + stderr + ' ```';
								return bot.sendMessage(msg.chat.id, message, {
									replyToMessage: msg.message_id,
									parseMode: 'Markdown'
								});
							} else {

								var message = '``` ' + stdout + ' ```';
								return bot.sendMessage(msg.chat.id, message, {
									replyToMessage: msg.message_id,
									parseMode: 'Markdown'
								});

							}

						}, {
							shell: true,
							cwd: '/opt/infrabot/infrabot'
						});

					// break;
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
