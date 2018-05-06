/*
 *
 * infrabot uptime
 *
 */

module.exports = {

    id: 'uptime',
    defaultConfig: {
        regExpEvents: true
    },

    plugin(bot, config) {
        const { regExpEvents } = config;
        const execSync = require('child_process').execSync;
		bot.on(['/uptime'], function(msg) {
			let uptime = execSync('uptime');
			let hostname = execSync('hostname');
			let message = '*' + 'report ' + hostname + '*' +
			'```' + uptime + '```';
			return bot.sendMessage(msg.chat.id, message, {
				replyToMessage: msg.message_id,
				parseMode: 'Markdown'
			});
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
