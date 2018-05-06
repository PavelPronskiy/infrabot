/*
 *
 * infrabot uptime
 *
 */

module.exports = function(telebot) {
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

