/*
 *
 * infrabot uptime
 *
 */

module.exports = {

    id: 'update',
    defaultConfig: null,

    plugin(bot, config) {
        
		bot.on(['/update'], function(msg) {
			
			let execSync = require('child_process').execSync;
			let hostname = execSync('hostname');
			let method = msg.text.split(' ');
			let updateResult = 'No results.';

			if (method[1]) {
				switch(method[1]) {
					case 'status':
						updateResult = execSync('git status');
					case 'now':
						updateResult = execSync('git pull');
					break;
				}
				
				let message = '``` ' + updateResult + ' ```';
				console.log(message);
				// let message = printInfraBotVersion();
				return bot.sendMessage(msg.chat.id, message, {
					replyToMessage: msg.message_id,
					parseMode: 'Markdown'
				});
			} else {
				message = 'Host ' + '*' + hostname + '*' + ' reported:' + "\n" +
				'``` please use: /update status, /update now ```';
				return bot.sendMessage(msg.chat.id, message, {
					replyToMessage: msg.message_id,
					parseMode: 'Markdown'
				});
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
